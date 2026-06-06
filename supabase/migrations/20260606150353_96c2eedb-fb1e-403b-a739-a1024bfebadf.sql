
-- ============== PROFILES ==============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== COURSES ==============
CREATE TYPE public.access_type AS ENUM ('purchase', 'subscription', 'both');

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  price_xof INTEGER NOT NULL DEFAULT 0,
  access_type public.access_type NOT NULL DEFAULT 'both',
  duration_hours NUMERIC,
  level TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone views published courses" ON public.courses
  FOR SELECT USING (is_published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== ENROLLMENTS / SUBSCRIPTIONS ==============
CREATE TYPE public.enrollment_status AS ENUM ('pending', 'active', 'cancelled', 'completed');

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status public.enrollment_status NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enrollments TO authenticated;
GRANT ALL ON public.enrollments TO service_role;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own enrollments" ON public.enrollments
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage enrollments" ON public.enrollments
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== ACCESS HELPER FUNCTION ==============
CREATE OR REPLACE FUNCTION public.has_course_access(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    public.has_role(_user_id, 'admin')
    OR EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE user_id = _user_id AND course_id = _course_id AND status IN ('active','completed')
    )
    OR EXISTS (
      SELECT 1 FROM public.subscriptions s
      JOIN public.courses c ON c.id = _course_id
      WHERE s.user_id = _user_id
        AND s.status = 'active'
        AND s.expires_at > now()
        AND c.access_type IN ('subscription','both')
    );
$$;

-- ============== MODULES ==============
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.modules TO authenticated;
GRANT ALL ON public.modules TO service_role;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users view modules" ON public.modules
  FOR SELECT TO authenticated USING (public.has_course_access(auth.uid(), course_id));
CREATE POLICY "Admins manage modules" ON public.modules
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== LESSONS ==============
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  resource_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO authenticated;
GRANT ALL ON public.lessons TO service_role;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users view lessons" ON public.lessons
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.modules m WHERE m.id = module_id AND public.has_course_access(auth.uid(), m.course_id))
  );
CREATE POLICY "Admins manage lessons" ON public.lessons
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== QUIZZES ==============
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL DEFAULT 'Quiz de validation',
  passing_score INTEGER NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quizzes TO authenticated;
GRANT ALL ON public.quizzes TO service_role;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users view quizzes" ON public.quizzes
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.modules m WHERE m.id = module_id AND public.has_course_access(auth.uid(), m.course_id))
  );
CREATE POLICY "Admins manage quizzes" ON public.quizzes
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled view questions" ON public.quiz_questions
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q JOIN public.modules m ON m.id = q.module_id
      WHERE q.id = quiz_id AND public.has_course_access(auth.uid(), m.course_id)
    )
  );
CREATE POLICY "Admins manage questions" ON public.quiz_questions
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_answers TO authenticated;
GRANT ALL ON public.quiz_answers TO service_role;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled view answers" ON public.quiz_answers
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.quiz_questions qq
      JOIN public.quizzes q ON q.id = qq.quiz_id
      JOIN public.modules m ON m.id = q.module_id
      WHERE qq.id = question_id AND public.has_course_access(auth.uid(), m.course_id)
    )
  );
CREATE POLICY "Admins manage answers" ON public.quiz_answers
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== PROGRESSION ==============
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress" ON public.lesson_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all progress" ON public.lesson_progress
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.quiz_attempts TO authenticated;
GRANT ALL ON public.quiz_attempts TO service_role;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attempts" ON public.quiz_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own attempts" ON public.quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============== UPDATED_AT TRIGGER ==============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

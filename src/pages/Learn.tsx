import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle2, Circle, PlayCircle, FileText, Lock, Award, ArrowLeft } from "lucide-react";

const Learn = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [progress, setProgress] = useState<Set<string>>(new Set());
  const [passedQuizzes, setPassedQuizzes] = useState<Set<string>>(new Set());
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth"); return; }
      setUserId(session.user.id);

      const { data: c } = await supabase.from("courses").select("*").eq("slug", slug!).maybeSingle();
      if (!c) { setLoading(false); return; }
      setCourse(c);

      const { data: mods } = await supabase
        .from("modules")
        .select("id, title, position, lessons(id, title, content, video_url, resource_url, position), quizzes(id, title, passing_score)")
        .eq("course_id", c.id)
        .order("position");

      if (mods) {
        const sorted = mods.map((m: any) => ({
          ...m,
          lessons: (m.lessons || []).sort((a: any, b: any) => a.position - b.position),
          quiz: m.quizzes?.[0] || null,
        }));
        setModules(sorted);
        if (sorted[0]?.lessons[0]) setCurrentLesson(sorted[0].lessons[0]);
      }

      const { data: lp } = await supabase.from("lesson_progress").select("lesson_id").eq("user_id", session.user.id);
      if (lp) setProgress(new Set(lp.map((p) => p.lesson_id)));

      const { data: qa } = await supabase.from("quiz_attempts").select("quiz_id, passed").eq("user_id", session.user.id).eq("passed", true);
      if (qa) setPassedQuizzes(new Set(qa.map((q) => q.quiz_id)));

      setLoading(false);
    };
    load();
  }, [slug, navigate]);

  const markComplete = async (lessonId: string) => {
    if (progress.has(lessonId)) return;
    await supabase.from("lesson_progress").insert({ user_id: userId!, lesson_id: lessonId });
    setProgress((p) => new Set(p).add(lessonId));
    toast.success("Leçon validée !");
  };

  const openQuiz = async (quiz: any) => {
    const { data: qs } = await supabase
      .from("quiz_questions")
      .select("id, question, position, quiz_answers(id, answer_text, position)")
      .eq("quiz_id", quiz.id)
      .order("position");
    setCurrentQuiz({ ...quiz, questions: (qs || []).map((q: any) => ({ ...q, answers: (q.quiz_answers || []).sort((a: any, b: any) => a.position - b.position) })) });
    setCurrentLesson(null);
    setQuizAnswers({});
  };

  const submitQuiz = async () => {
    if (!currentQuiz) return;
    const answerIds = Object.values(quizAnswers);
    if (answerIds.length !== currentQuiz.questions.length) {
      toast.error("Répondez à toutes les questions");
      return;
    }
    const { data: correct } = await supabase
      .from("quiz_answers")
      .select("id, question_id")
      .in("id", answerIds)
      .eq("is_correct", true);
    const correctCount = correct?.length || 0;
    const score = Math.round((correctCount / currentQuiz.questions.length) * 100);
    const passed = score >= currentQuiz.passing_score;

    await supabase.from("quiz_attempts").insert({
      user_id: userId!,
      quiz_id: currentQuiz.id,
      score,
      passed,
      answers: quizAnswers,
    });

    if (passed) {
      setPassedQuizzes((p) => new Set(p).add(currentQuiz.id));
      toast.success(`Quiz réussi ! Score : ${score}%`);
    } else {
      toast.error(`Score : ${score}% — minimum requis : ${currentQuiz.passing_score}%`);
    }
    setCurrentQuiz(null);
  };

  if (loading) return <Layout><div className="pt-32 pb-20 text-center">Chargement...</div></Layout>;
  if (!course) return <Layout><div className="pt-32 pb-20 text-center">Formation introuvable</div></Layout>;

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = modules.reduce((s, m) => s + m.lessons.filter((l: any) => progress.has(l.id)).length, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const isModuleUnlocked = (idx: number) => {
    if (idx === 0) return true;
    const prev = modules[idx - 1];
    if (prev.quiz) return passedQuizzes.has(prev.quiz.id);
    return prev.lessons.every((l: any) => progress.has(l.id));
  };

  return (
    <Layout>
      <section className="pt-24 pb-12 bg-muted min-h-screen">
        <div className="container mx-auto px-4">
          <Button variant="ghost" onClick={() => navigate(`/formations/${slug}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la formation
          </Button>

          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display text-xl font-bold">{course.title}</h1>
              <span className="text-sm text-muted-foreground">{completedLessons}/{totalLessons} leçons</span>
            </div>
            <Progress value={overallProgress} />
            {overallProgress === 100 && (
              <div className="mt-3 flex items-center gap-2 text-secondary">
                <Award className="w-5 h-5" /> <span className="font-semibold">Formation terminée !</span>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            {/* Sidebar */}
            <aside className="bg-card rounded-xl border border-border p-4 h-fit lg:sticky lg:top-24">
              <h2 className="font-semibold mb-3 px-2">Programme</h2>
              <div className="space-y-3">
                {modules.map((m, i) => {
                  const unlocked = isModuleUnlocked(i);
                  return (
                    <div key={m.id} className={!unlocked ? "opacity-50" : ""}>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
                        {unlocked ? <Circle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        Module {i + 1} : {m.title}
                      </div>
                      <div className="ml-6 space-y-1">
                        {m.lessons.map((l: any) => (
                          <button
                            key={l.id}
                            disabled={!unlocked}
                            onClick={() => { setCurrentLesson(l); setCurrentQuiz(null); }}
                            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                              currentLesson?.id === l.id ? "bg-secondary/10 text-secondary" : "hover:bg-muted"
                            } disabled:cursor-not-allowed`}
                          >
                            {progress.has(l.id) ? <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" /> : <PlayCircle className="w-4 h-4 flex-shrink-0" />}
                            <span className="truncate">{l.title}</span>
                          </button>
                        ))}
                        {m.quiz && (
                          <button
                            disabled={!unlocked}
                            onClick={() => openQuiz(m.quiz)}
                            className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                              currentQuiz?.id === m.quiz.id ? "bg-bordeaux/10 text-bordeaux" : "hover:bg-muted"
                            } disabled:cursor-not-allowed`}
                          >
                            {passedQuizzes.has(m.quiz.id) ? <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" /> : <FileText className="w-4 h-4 flex-shrink-0" />}
                            <span className="truncate font-medium">Quiz du module</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Content */}
            <main className="bg-card rounded-xl border border-border p-6">
              {currentQuiz ? (
                <div>
                  <Badge className="mb-3 bg-bordeaux text-white">Quiz · Note minimale {currentQuiz.passing_score}%</Badge>
                  <h2 className="font-display text-2xl font-bold mb-6">{currentQuiz.title}</h2>
                  <div className="space-y-6">
                    {currentQuiz.questions.map((q: any, i: number) => (
                      <div key={q.id} className="border-l-4 border-secondary pl-4">
                        <p className="font-semibold mb-3">{i + 1}. {q.question}</p>
                        <div className="space-y-2">
                          {q.answers.map((a: any) => (
                            <label key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={a.id}
                                checked={quizAnswers[q.id] === a.id}
                                onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: a.id })}
                              />
                              <span>{a.answer_text}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={submitQuiz} size="lg" className="mt-6 bg-secondary text-secondary-foreground hover:bg-teal-light">
                    Valider le quiz
                  </Button>
                </div>
              ) : currentLesson ? (
                <div>
                  <h2 className="font-display text-2xl font-bold mb-4">{currentLesson.title}</h2>
                  {currentLesson.video_url && (
                    <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden">
                      <iframe src={currentLesson.video_url} className="w-full h-full" allowFullScreen title={currentLesson.title} />
                    </div>
                  )}
                  {currentLesson.content && (
                    <div className="prose max-w-none whitespace-pre-wrap text-foreground/90 mb-6">{currentLesson.content}</div>
                  )}
                  {currentLesson.resource_url && (
                    <a href={currentLesson.resource_url} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 text-secondary hover:underline mb-6">
                      <FileText className="w-4 h-4" /> Télécharger la ressource
                    </a>
                  )}
                  <div className="border-t border-border pt-4 mt-6">
                    {progress.has(currentLesson.id) ? (
                      <Badge variant="secondary"><CheckCircle2 className="w-4 h-4 mr-1" /> Leçon terminée</Badge>
                    ) : (
                      <Button onClick={() => markComplete(currentLesson.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Marquer comme terminé
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-12">Sélectionnez une leçon pour commencer</p>
              )}
            </main>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Learn;

/**
 * Analytics Dashboard — Non-indexed PUBLIC page for viewing poll results
 * Fetches data from tRPC admin routes (no auth required)
 * Route: /analytics (noindex via meta tag)
 */
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { ArrowLeft, Download, Users, BarChart3, Clock, Mail, Loader2 } from "lucide-react";
import { questions, questionLabels } from "@/lib/pollData";
import { trpc } from "@/lib/trpc";

// Gold-toned palette for charts
const CHART_COLORS = [
  "#C9A96E",
  "#B8956A",
  "#A68060",
  "#8C6B4F",
  "#6E5540",
  "#D4B88C",
];

export default function Analytics() {
  // Set noindex meta tag
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    const title = document.title;
    document.title = "Poll Analytics — Dashboard";
    return () => {
      document.head.removeChild(meta);
      document.title = title;
    };
  }, []);

  // Fetch data from tRPC routes (public — no auth required)
  const { data: submissions, isLoading: subsLoading } = trpc.admin.submissions.useQuery();
  const { data: csvData } = trpc.admin.exportCsv.useQuery();

  // Map submissions to the format used by the analytics UI
  const responses = useMemo(() => {
    if (!submissions) return [];
    return submissions.map((s) => ({
      id: s.id,
      timestamp: s.createdAt ? new Date(s.createdAt).toISOString() : "",
      email: s.email ?? "",
      "0": s.q0 ?? "",
      "1": s.q1 ?? "",
      "2": s.q2 ?? "",
      "3": s.q3 ?? "",
      "4": s.q4 ?? "",
      "5": s.q5 ?? "",
      "6": s.q6 ?? "",
    }));
  }, [submissions]);

  // Compute analytics per question
  const questionAnalytics = useMemo(() => {
    return questions.map((q, qIndex) => {
      const counts: Record<string, number> = {};
      q.options.forEach((opt) => {
        counts[opt.label] = 0;
      });
      responses.forEach((r) => {
        const answer = r[qIndex.toString() as keyof typeof r] as string;
        if (answer && counts[answer] !== undefined) {
          counts[answer]++;
        }
      });
      const data = Object.entries(counts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      const topAnswer = data[0]?.value > 0 ? data[0].name : "—";
      return { headline: q.headline, label: questionLabels[qIndex], data, topAnswer };
    });
  }, [responses]);

  const totalResponses = responses.length;
  const emailCount = responses.filter((r) => r.email && r.email.trim() !== "").length;
  const latestResponse =
    responses.length > 0
      ? new Date(responses[0].timestamp).toLocaleString()
      : "—";

  // CSV download from server
  const downloadCSV = () => {
    if (!csvData) return;
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "community-poll-responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const pct = totalResponses > 0 ? ((d.value / totalResponses) * 100).toFixed(1) : "0";
      return (
        <div className="bg-white border border-border rounded-xl px-4 py-3 shadow-lg">
          <p className="text-sm font-medium text-charcoal">{d.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {d.value} response{d.value !== 1 ? "s" : ""} ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Data loading state
  if (subsLoading) {
    return (
      <div className="min-h-dvh bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="text-sm text-muted-foreground">Loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-border/50">
        <div className="container max-w-[1100px] mx-auto flex items-center justify-between py-4 px-5">
          <Link href="/">
            <motion.span
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-charcoal transition-colors"
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Poll
            </motion.span>
          </Link>

          <h1 className="font-serif text-lg sm:text-xl font-semibold text-charcoal">
            Poll Analytics
          </h1>

          <motion.button
            onClick={downloadCSV}
            disabled={totalResponses === 0}
            className="inline-flex items-center gap-2 text-sm text-charcoal bg-white border border-border rounded-full px-4 py-2 hover:border-gold hover:text-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.97 }}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </motion.button>
        </div>
      </header>

      <main className="container max-w-[1100px] mx-auto px-5 py-8 sm:py-12">
        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SummaryCard
            icon={<Users className="w-5 h-5" />}
            label="Total Responses"
            value={totalResponses.toString()}
          />
          <SummaryCard
            icon={<Mail className="w-5 h-5" />}
            label="Emails Collected"
            value={emailCount.toString()}
          />
          <SummaryCard
            icon={<BarChart3 className="w-5 h-5" />}
            label="Questions"
            value={questions.length.toString()}
          />
          <SummaryCard
            icon={<Clock className="w-5 h-5" />}
            label="Latest Response"
            value={latestResponse}
            small
          />
        </motion.div>

        {/* No data state */}
        {totalResponses === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-serif text-xl text-charcoal mb-2">No responses yet</p>
            <p className="text-sm text-muted-foreground">
              Share the poll link with your community to start collecting responses.
            </p>
          </motion.div>
        )}

        {/* Question Breakdown Cards */}
        {totalResponses > 0 && (
          <div className="space-y-8">
            {questionAnalytics.map((qa, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                {/* Card Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border/40">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.7rem] font-medium tracking-[0.1em] uppercase text-gold mb-1.5">
                        Question {idx + 1} of {questions.length}
                      </p>
                      <h3 className="font-serif text-lg font-semibold text-charcoal">
                        {qa.headline}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground/60 mb-0.5">
                        Top Answer
                      </p>
                      <p className="text-sm font-medium text-gold">{qa.topAnswer}</p>
                    </div>
                  </div>
                </div>

                {/* Chart + Table */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0">
                  {/* Bar Chart */}
                  <div className="px-6 py-6">
                    <ResponsiveContainer width="100%" height={Math.max(200, qa.data.length * 44)}>
                      <BarChart
                        data={qa.data}
                        layout="vertical"
                        margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
                        barCategoryGap="20%"
                      >
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="name"
                          type="category"
                          width={130}
                          tick={{ fontSize: 12, fill: "#6B6B6B" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
                          {qa.data.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart + Table */}
                  <div className="px-6 py-6 border-t lg:border-t-0 lg:border-l border-border/40">
                    <div className="flex items-center justify-center mb-4">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie
                            data={qa.data.filter((d) => d.value > 0)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            strokeWidth={2}
                            stroke="#FAF7F2"
                          >
                            {qa.data
                              .filter((d) => d.value > 0)
                              .map((_, i) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                              ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Data Table */}
                    <div className="space-y-2">
                      {qa.data.map((d, i) => {
                        const pct =
                          totalResponses > 0
                            ? ((d.value / totalResponses) * 100).toFixed(1)
                            : "0";
                        return (
                          <div key={d.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-3 h-3 rounded-sm shrink-0"
                                style={{
                                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                                }}
                              />
                              <span className="text-charcoal truncate max-w-[140px]">
                                {d.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground tabular-nums">{d.value}</span>
                              <span className="text-muted-foreground/60 text-xs tabular-nums w-12 text-right">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Response Log */}
        {totalResponses > 0 && (
          <motion.div
            className="mt-12 bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="px-6 pt-6 pb-4 border-b border-border/40">
              <h3 className="font-serif text-lg font-semibold text-charcoal">
                Response Log
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Individual responses in chronological order
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-cream/50">
                    <th className="text-left px-4 py-3 text-[0.7rem] font-medium tracking-wider uppercase text-muted-foreground/70">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-[0.7rem] font-medium tracking-wider uppercase text-muted-foreground/70">
                      Time
                    </th>
                    <th className="text-left px-4 py-3 text-[0.7rem] font-medium tracking-wider uppercase text-muted-foreground/70">
                      Email
                    </th>
                    {questionLabels.map((_, i) => (
                      <th
                        key={i}
                        className="text-left px-4 py-3 text-[0.7rem] font-medium tracking-wider uppercase text-muted-foreground/70 whitespace-nowrap"
                      >
                        Q{i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r, idx) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/20 hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-charcoal whitespace-nowrap">
                        {new Date(r.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-charcoal">
                        {r.email || (
                          <span className="text-muted-foreground/40 italic">none</span>
                        )}
                      </td>
                      {questionLabels.map((_, i) => (
                        <td key={i} className="px-4 py-3 text-charcoal whitespace-nowrap">
                          {(r[i.toString() as keyof typeof r] as string) || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-xs text-muted-foreground/50">
            Data stored securely in the database. Export CSV to download a local copy.
          </p>
        </div>
      </main>
    </div>
  );
}

/* Summary Card Component */
function SummaryCard({
  icon,
  label,
  value,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-border/60 px-5 py-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="text-gold">{icon}</div>
        <span className="text-[0.7rem] font-medium tracking-[0.08em] uppercase text-muted-foreground/70">
          {label}
        </span>
      </div>
      <p
        className={`font-serif font-semibold text-charcoal leading-tight ${
          small ? "text-sm" : "text-2xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

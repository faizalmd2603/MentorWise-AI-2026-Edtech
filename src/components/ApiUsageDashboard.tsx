import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Activity, RefreshCw, ShieldCheck } from "lucide-react";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { getApiMonitoring } from "@/lib/api-monitoring.functions";
import { API_MONITOR_EMAIL, API_MONITOR_REFRESH_MS } from "@/lib/api-monitoring";
import { Button } from "@/components/ui/button";

const number = (value: number | null | undefined) => value == null ? "Unavailable" : value.toLocaleString();

export function ApiUsageDashboard() {
  const { user, isReady } = useAuthReady();
  const getReport = useServerFn(getApiMonitoring);
  const eligible = isReady && user?.email?.toLowerCase() === API_MONITOR_EMAIL;
  const query = useQuery({
    queryKey: ["private-api-monitoring", user?.id],
    queryFn: () => getReport(),
    enabled: eligible,
    refetchInterval: API_MONITOR_REFRESH_MS,
    retry: false,
    staleTime: 10_000,
    gcTime: 0,
  });
  // No visible dashboard until the server has confirmed access.
  if (!eligible || !query.data?.allowed) return null;
  const { report, checkedAt, configured } = query.data;
  if (!report) return null;
  return (
    <section aria-label="Private API usage" className="mb-6 border-y border-border bg-background/90 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><ShieldCheck className="h-5 w-5 text-primary" /> API usage · Private</h2>
          <p className="mt-1 text-xs text-muted-foreground">Every 30 seconds · {checkedAt ? `Updated ${new Date(checkedAt).toLocaleTimeString()}` : "Awaiting update"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void query.refetch()} disabled={query.isFetching}><RefreshCw className={query.isFetching ? "animate-spin" : ""} /> Refresh</Button>
      </div>
      {query.isError && <p role="alert" className="mt-3 text-sm text-destructive">Refresh failed. Showing the last successful report.</p>}
      <p className="mt-3 text-xs text-muted-foreground">Recorded app requests only{report.startedAt ? ` since ${new Date(report.startedAt).toLocaleString()}` : " · No requests recorded yet"}. Earlier or outside-app usage is unavailable. Remaining tokens are provider-reported rate-window capacity, not an account balance; unavailable quotas are never estimated.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from(new Set([...configured, ...report.providers.map(p => p.provider)])).map(provider => {
          const row = report.providers.find(p => p.provider === provider);
          return <article key={provider} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2"><h3 className="font-semibold capitalize">{provider}</h3><Activity className="h-4 w-4 text-primary" /></div>
            <p className="mt-1 text-xs text-muted-foreground">{row ? `Last HTTP ${row.latest.status || "network error"}` : "Awaiting first request"}</p>
            <dl className="mt-3 space-y-1 text-xs">
              <div className="flex justify-between gap-2"><dt>Requests / errors</dt><dd>{row?.requests ?? 0} / {row?.errors ?? 0}</dd></div>
              <div className="flex justify-between gap-2"><dt>Input / output tokens</dt><dd>{number(row?.input_tokens)} / {number(row?.output_tokens)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Total reported tokens</dt><dd>{number(row?.total_tokens)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Remaining tokens</dt><dd>{number(row?.latest.remaining_tokens)}</dd></div>
              <div className="flex justify-between gap-2"><dt>Remaining requests</dt><dd>{number(row?.latest.remaining_requests)}</dd></div>
            </dl>
            {row && <p className="mt-2 text-xs text-muted-foreground">{row.metered_requests}/{row.requests} requests include token usage{row.latest.quota_reset ? ` · Reset: ${row.latest.quota_reset}` : ""} · Quota sampled {new Date(row.latest.recorded_at).toLocaleTimeString()}</p>}
          </article>;
        })}
      </div>
      {report.recent.length > 0 && <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-xs"><caption className="pb-2 text-left font-medium">Latest real requests</caption><thead><tr className="border-b border-border text-muted-foreground"><th className="py-2">Time</th><th>Provider / operation</th><th>Model</th><th>Status</th><th>Tokens</th><th>Duration</th></tr></thead><tbody>{report.recent.map((row, index) => <tr key={`${row.recorded_at}-${index}`} className="border-b border-border/50"><td className="py-2">{new Date(row.recorded_at).toLocaleTimeString()}</td><td>{row.provider} / {row.operation}</td><td>{row.model}</td><td>{row.status || "Network error"}</td><td>{number(row.total_tokens)}</td><td>{row.duration_ms} ms</td></tr>)}</tbody></table></div>}
    </section>
  );
}
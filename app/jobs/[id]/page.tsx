import JobDetail from "@/components/jobs/JobDetail";

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  return <JobDetail params={params} />;
}

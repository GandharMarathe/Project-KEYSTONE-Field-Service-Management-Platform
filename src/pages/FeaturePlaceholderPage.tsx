import { Construction } from "lucide-react";
import { EmptyState } from "../components/common/Feedback";
export function FeaturePlaceholderPage({ title, description }: { title: string; description: string }) { return <div className="page"><div className="page-heading"><div><p className="eyebrow">KEYSTONE</p><h1>{title}</h1><p>{description}</p></div></div><section className="panel feature-placeholder"><Construction size={28} /><h2>{title}</h2><EmptyState message="No data available" /></section></div>; }

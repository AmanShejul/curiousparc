import { responsePlan } from '../data/mockData'
import ResponsePlan from '../components/dashboard/ResponsePlan'
export default function ResponsePlansPage() { return <div className="generic-page narrow-page"><div className="page-heading"><div><div className="eyebrow">Decision support</div><h1>Response plans</h1><p>Review generated recommendations before dispatch.</p></div></div><ResponsePlan plan={responsePlan} /></div> }

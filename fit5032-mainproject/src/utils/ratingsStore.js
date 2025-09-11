const RATINGS_KEY = 'yw_ratings' // { [targetId]: { count, sum } }

function load(){ try{ return JSON.parse(localStorage.getItem(RATINGS_KEY))||{} }catch{ return {} } }
function save(d){ localStorage.setItem(RATINGS_KEY, JSON.stringify(d)) }

export function rate(targetId, value){
  const d = load()
  const cur = d[targetId] || { count:0, sum:0 }
  d[targetId] = { count: cur.count+1, sum: cur.sum + Number(value) }
  save(d)
}
export function getAverage(targetId){
  const r = load()[targetId]
  if(!r || r.count===0) return { avg:0, count:0 }
  return { avg: +(r.sum / r.count).toFixed(2), count: r.count }
}

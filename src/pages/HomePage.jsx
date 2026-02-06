import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

function groupBySimilarity(questions) {
  const groups = {}
  let nullCounter = 0

  for (const q of questions) {
    const groupId = q.similarity_group_id
    if (!groupId) {
      groups[`__null_${nullCounter++}`] = [q]
    } else {
      if (!groups[groupId]) groups[groupId] = []
      groups[groupId].push(q)
    }
  }

  return Object.values(groups).sort((a, b) => b.length - a.length)
}

function HomePage() {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [revealedAnswers, setRevealedAnswers] = useState({})

  useEffect(() => {
    fetch('/questions_with_similarity.json')
      .then(res => res.json())
      .then(data => {
        setGroups(groupBySimilarity(data))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleAnswer = (index) => {
    setRevealedAnswers(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const renderMarkdown = (text) => {
    if (!text) return null
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="table table-zebra table-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-base-300">{children}</thead>,
          th: ({ children }) => <th className="px-2 py-1">{children}</th>,
          td: ({ children }) => <td className="px-2 py-1">{children}</td>,
          p: ({ children }) => <p className="mb-2">{children}</p>,
        }}
      >
        {text}
      </ReactMarkdown>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Exam Preparation</h1>

      <div className="text-center mb-6">
        <Link to="/similarity-groups" className="btn btn-secondary">
          View Similarity Groups
        </Link>
      </div>

      <div className="space-y-4">
        {groups.map((group, groupIndex) => {
          const sorted = [...group].sort((a, b) =>
            (b.data?.question_text?.length || 0) - (a.data?.question_text?.length || 0)
          )
          const item = sorted.find(q => q.data?.correct_answer?.trim()) || sorted[0]
          const repetitions = group.length
          const isRevealed = revealedAnswers[groupIndex]

          return (
            <div key={groupIndex} className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="text-center prose prose-sm max-w-none w-full">
                  {renderMarkdown(item.data?.question_text)}
                </div>

                {item.data?.options && item.data.options.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {item.data.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                )}

                {isRevealed ? (
                  <div className="mt-4 p-4 bg-success/10 rounded-lg">
                    <h3 className="font-semibold mb-2 text-success">Answer:</h3>
                    <div className="prose prose-sm max-w-none">
                      {renderMarkdown(item.data?.correct_answer)}
                    </div>
                  </div>
                ) : (
                  <div className="card-actions justify-center mt-4">
                    <button className="btn btn-primary" onClick={() => toggleAnswer(groupIndex)}>
                      Answer
                    </button>
                  </div>
                )}

                {repetitions > 1 && (
                  <div className="flex justify-end mt-2">
                    <span className="badge badge-warning">&times;{repetitions}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage

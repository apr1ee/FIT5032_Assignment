const JOURNALS_KEY = 'yw_journals'
const DRAFT_KEY = 'yw_journal_draft'

export function loadJournals() {
  try {
    return JSON.parse(localStorage.getItem(JOURNALS_KEY)) || []
  } catch {
    return []
  }
}

export function saveJournals(list) {
  localStorage.setItem(JOURNALS_KEY, JSON.stringify(list))
}

export function saveDraft(draft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_KEY)) || { mood: 3, text: '', tags: '' }
  } catch {
    return { mood: 3, text: '', tags: '' }
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

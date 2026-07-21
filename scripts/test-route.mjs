import { createInitialSnapshot, resolveMonth } from '../src/lib/gameEngine.js'

let snapshot = createInitialSnapshot()
const history = []

const choices = [
  'month-1-a', // M1
  'month-2-a', // M2
  'month-3-b', // M3
  null,        // M4 (Auto)
  'month-5-a', // M5
  null,        // M6 (Auto)
  'month-7-a', // M7
  'month-8-a', // M8
  'month-9-a', // M9
  null         // M10 (Finale)
]

for (let month = 1; month <= 10; month++) {
  const choiceId = choices[month - 1]
  const resolution = resolveMonth({
    month,
    snapshot,
    choiceId,
    history
  })
  history.push({
    month: resolution.month,
    eventId: resolution.eventId,
    eventTitle: resolution.eventTitle,
    selectedChoiceId: resolution.selectedChoiceId,
    selectedChoiceTitle: resolution.selectedChoiceTitle,
    eventMessage: resolution.eventMessage,
    before: resolution.before,
    directEffects: resolution.directEffects,
    settlement: resolution.settlement,
    after: resolution.after,
    endingTriggered: resolution.endingTriggered
  })
  snapshot = resolution.after
  console.log(`Month ${month}: LLSX=${snapshot.llsx}, QHSX=${snapshot.qhsx}, Budget=${snapshot.budget}, Delta=${snapshot.delta}, Ending=${resolution.endingTriggered}`)
}

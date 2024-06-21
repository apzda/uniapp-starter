import { loadMessages, type Msg } from '@/utils/i18n'

const messages = import.meta.glob('../**/lang/en.json', { eager: true, import: 'default' })

export default loadMessages(messages as Msg)

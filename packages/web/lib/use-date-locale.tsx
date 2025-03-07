import { enGB, zhCN } from "date-fns/locale"
import { useLocale } from "next-intl"

export const useDateLocale = () => {
    const locale = useLocale()
    return { locale: { zh: zhCN, en: enGB }[locale] || zhCN }
}

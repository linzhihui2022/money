import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CookbookContent, CookbookStepPhase } from "ai/type"
import { motion } from "framer-motion"
import { ArrowDownIcon, ArrowUpIcon, ListPlusIcon, MinusIcon, PlusIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { ComponentProps, useState } from "react"
import { v4 } from "uuid"

const ButtonGroup = ({
    index,
    setValueAction,
    value,
    step,
}: {
    index: number
    value: CookbookContent["steps"]
    step: CookbookContent["steps"][number]
    setValueAction: (v: CookbookContent["steps"]) => void
}) => {
    const t = useTranslations("sr-only")

    return (
        <div className="flex justify-end">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === 0}
                onClick={() => {
                    const _steps = [...value]
                    const tmp = _steps[index]
                    _steps[index] = _steps[index - 1]
                    _steps[index - 1] = tmp
                    setValueAction([..._steps])
                }}>
                <span className="sr-only">{t("Move up")}</span>
                <ArrowUpIcon />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === value.length - 1}
                onClick={() => {
                    const _steps = [...value]
                    const tmp = _steps[index]
                    _steps[index] = _steps[index + 1]
                    _steps[index + 1] = tmp
                    setValueAction([..._steps])
                }}>
                <ArrowDownIcon />
                <span className="sr-only">{t("Move down")}</span>
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                    const _steps = [...value]
                    _steps.splice(index, 1)
                    setValueAction([..._steps])
                }}>
                <span className="sr-only">{t("Delete")}</span>
                <MinusIcon />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                    const _steps = [...value]
                    const tail = _steps.splice(index)
                    setValueAction([..._steps, { content: "", phase: step.phase, key: v4() }, ...tail])
                }}>
                <ListPlusIcon />
            </Button>
        </div>
    )
}
const PhaseSelect = (props: ComponentProps<typeof Select>) => {
    const t = useTranslations("cookbook.Phase")

    return (
        <Select {...props}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={CookbookStepPhase.PREPARE}>{t(CookbookStepPhase.PREPARE)}</SelectItem>
                <SelectItem value={CookbookStepPhase.PROGRESS}>{t(CookbookStepPhase.PROGRESS)}</SelectItem>
                <SelectItem value={CookbookStepPhase.DONE}>{t(CookbookStepPhase.DONE)}</SelectItem>
            </SelectContent>
        </Select>
    )
}
export const CookbookContentSteps = ({
    value,
    setValueAction,
}: {
    value: CookbookContent["steps"]
    setValueAction: (v: CookbookContent["steps"]) => void
}) => {
    const [init, setInit] = useState<CookbookContent["steps"][number]>({
        phase: CookbookStepPhase.PREPARE,
        content: "",
        key: v4(),
    })
    if (value.length === 0) {
        return (
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-7">
                    <PhaseSelect
                        value={init.phase}
                        onValueChange={(phase: CookbookStepPhase) => setInit((v) => ({ ...v, phase: phase }))}
                    />
                </div>
                <div className="col-span-12">
                    <Textarea
                        value={init.content}
                        onChange={(e) => setInit((v) => ({ ...v, content: e.target.value }))}
                    />
                </div>
                <div className="col-span-12">
                    <Button className="w-full" type="button" variant="secondary" onClick={() => setValueAction([init])}>
                        <PlusIcon />
                    </Button>
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-2">
            <ul className="flex flex-col space-y-2">
                {value.map((step, index) => (
                    <motion.li
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        layout
                        key={step.key}
                        className="space-y-2">
                        <div className="flex justify-between space-x-2">
                            <div className="min-w-[200px]">
                                <PhaseSelect
                                    value={step.phase}
                                    onValueChange={(v) => {
                                        const _steps = [...value]
                                        _steps[index].phase = v as CookbookStepPhase
                                        setValueAction([..._steps])
                                    }}
                                />
                            </div>
                            <ButtonGroup value={value} setValueAction={setValueAction} step={step} index={index} />
                        </div>
                        <Textarea
                            value={step.content}
                            onChange={(e) => {
                                const _steps = [...value]
                                _steps[index].content = e.target.value
                                setValueAction([..._steps])
                            }}
                        />
                    </motion.li>
                ))}
            </ul>
            <div className="w-full">
                <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    onClick={() => {
                        const _steps = [...value]
                        setValueAction([
                            ..._steps,
                            {
                                content: "",
                                phase: CookbookStepPhase.DONE,
                                key: v4(),
                            },
                        ])
                    }}>
                    <PlusIcon />
                </Button>
            </div>
        </div>
    )
}

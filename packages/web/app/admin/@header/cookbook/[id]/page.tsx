import Delete from "@/features/cookbook/table/delete"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id
    return <Delete id={id} />
}

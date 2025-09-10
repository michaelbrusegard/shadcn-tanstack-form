import { ExampleForm } from "@/registry/default/blocks/example-form"

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Shadcn Tanstack Form</h1>
        <p className="text-muted-foreground">
          A custom registry for using Tanstack Form with Shadcn UI.
        </p>
      </header>
      <main className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-4 border rounded-lg p-4 min-h-[450px] relative">
          <div className="flex items-center justify-center min-h-[500px] relative">
            <ExampleForm />
          </div>
        </div>
      </main>
    </div>
  )
}

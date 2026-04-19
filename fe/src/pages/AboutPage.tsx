export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="sm:grid sm:grid-cols-[160px_1fr] sm:gap-12">
        <aside className="mb-6 sm:mb-0 sm:pt-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">About</p>
        </aside>

        <div className="max-w-xl">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6 sm:mb-8 leading-tight">
            On Writing &<br />Remembering.
          </h1>

          <div className="prose-journal space-y-5">
            <p>
              This is a quiet corner of the internet — a place for essays, observations,
              and the kind of thinking that needs more than a sentence to unfold.
              Literature has always been my way of making sense of the world: not by
              arriving at answers, but by learning to ask better questions.
            </p>

            <p>
              I am a student of English Literature, drawn equally to the Romantics and
              to contemporary fiction. I find myself returning again and again to the
              idea that language is not merely a tool of communication, but a medium of
              memory — a way of holding time still for long enough to look at it.
            </p>

            <blockquote>
              "A writer only begins a book. A reader finishes it."
              <br />
              <span className="text-sm not-italic text-muted-foreground">— Samuel Johnson</span>
            </blockquote>

            <p>
              These pages collect my attempts to read closely and write honestly — about
              books, about language, about the small rituals that give shape to an
              ordinary day. Nothing here is meant to be definitive. Everything is meant
              to be sincere.
            </p>

            <p>
              If something here stays with you, I am glad. If it sends you back to a
              book you once loved, I am even gladder.
            </p>
          </div>

          <div className="mt-10 sm:mt-12 pt-8 border-t border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Currently reading</p>
            <p className="font-serif italic text-foreground">
              Middlemarch — George Eliot
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

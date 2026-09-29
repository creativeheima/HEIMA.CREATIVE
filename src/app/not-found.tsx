import "./globals.css";
import { Button } from "@/components/ui/Button";
import { CircuitLines, GridPattern } from "@/components/visuals/Patterns";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-mist">
      <GridPattern />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-full opacity-60">
        <CircuitLines />
      </div>
      <div className="container-x relative">
        <p className="meta text-steel">Error 404</p>
        <h1 className="display-xl mt-6 text-navy">
          Page not
          <br />
          found<span className="text-signal">.</span>
        </h1>
        <p className="mt-8 max-w-md text-steel">Halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
        <div className="mt-10">
          <Button href="/">Back to home</Button>
        </div>
      </div>
    </section>
  );
}

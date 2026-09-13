import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-8 lg:px-12">
        {/* COPYRIGHT */}
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} WorkBee. All rights reserved.
        </p>

        {/* SOCIAL LINKS */}
        <div className="flex items-center gap-2">
          {/* X */}
          <a
            href="https://x.com/rishadbuilds"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WorkBee on X"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.963 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </svg>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/rishadbuilds"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WorkBee on GitHub"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
          >
            <Github className="h-4 w-4" />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/rishadkarappa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WorkBee on LinkedIn"
            className="
              flex h-9 w-9 items-center justify-center
              rounded-full
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
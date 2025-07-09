import PageIllustration from "@/components/PageIllustration";
import { CodeBlock } from "../CodeBlock";
import { Button } from "../ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function HeroHome({handleLogin}: {
  handleLogin: () => Promise<void>;
  }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      handleLogin();
    }
  };

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-6 border-y text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold [border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1] text-foreground leading-tight"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              The modern code snippet manager
              <br className="hidden sm:block" />
              for developers
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-base sm:text-lg text-muted-foreground leading-relaxed px-4 sm:px-0"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Snippets Library helps you store, organize, and share code snippets
                with beautiful syntax highlighting, instant search, and
                public/private sharing. Built for productivity and collaboration.
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1]">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center gap-4"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <Button
                    className="btn group mb-4 w-full bg-primary bg-gradient-to-t from-primary to-primary/80 text-primary-foreground shadow-sm hover:bg-primary/90 sm:mb-0 sm:w-auto px-6 py-3 text-sm sm:text-base"
                    onClick={handleButtonClick}
                    disabled={false}
                  >
                    <span className="relative inline-flex items-center">
                      {user ? "Go to Dashboard" : "Try it now"}
                      <span className="ml-1 tracking-normal text-primary-foreground/70 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </Button>
                  <a
                    className="btn w-full bg-background text-foreground shadow-sm hover:bg-muted hover:text-foreground sm:w-auto px-6 py-3 text-sm sm:text-base"
                    href="https://github.com/cojocaru-david/snippetslibrary.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Hero image */}
          <div
            className="mx-auto max-w-3xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative aspect-video rounded-2xl bg-background/90 px-3 sm:px-5 py-3 shadow-xl before:pointer-events-none before:absolute before:-inset-5 before:border-y before:[border-image:linear-gradient(to_right,transparent,var(--color-border),transparent)1] after:absolute after:-inset-5 after:-z-10 after:border-x after:[border-image:linear-gradient(to_bottom,transparent,var(--color-border),transparent)1] overflow-hidden">
              <div className="relative mb-4 sm:mb-8 flex items-center justify-between before:block before:h-[9px] before:w-[41px] before:bg-[length:16px_9px] before:[background-image:radial-gradient(circle_at_4.5px_4.5px,var(--color-muted-foreground)_4.5px,transparent_0)] after:w-[41px]">
                <span className="text-xs sm:text-[13px] font-medium text-foreground">
                  snippetslibrary.com
                </span>
              </div>
              <div className="relative overflow-hidden">
                <div className="hidden sm:block">
                  <CodeBlock
                    language="javascript"
                    code={`import { useState } from 'react';

// A simple counter component
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
  
export default Counter;`}
                    theme="github-dark"
                    showCopyButton={true}
                    showDownloadButton={true}
                    showExpandButton={true}
                  />
                </div>
                <div className="sm:hidden">
                  <CodeBlock
                    language="javascript"
                    code={`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`}
                    theme="github-dark"
                    showCopyButton={true}
                    showDownloadButton={false}
                    showExpandButton={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

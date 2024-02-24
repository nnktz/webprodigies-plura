import Image from 'next/image'
import { PricingCards } from './_components/pricing-cards'

const SitePage = () => {
  return (
    <>
      <section className="relative flex h-full w-full flex-col items-center justify-center md:pt-44">
        <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <p className="text-center">Run your agency, in one place</p>

        <div className="relative bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          <h1 className="text-center text-9xl font-bold md:text-[300px]">Plura</h1>
        </div>

        <div className="relative flex items-center justify-center md:mt-[-70px]">
          <Image
            src={'/assets/preview.png'}
            alt="banner image"
            height={1200}
            width={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />

          <div className="absolute bottom-0 left-0 right-0 top-[50%] z-10 bg-gradient-to-t dark:from-background" />
        </div>
      </section>

      <section className="mt-[-60px] flex flex-col items-center justify-center gap-4 md:mt-20">
        <h2 className="text-center text-4xl">Choose what fits you right</h2>
        <p className="text-center text-muted-foreground">
          Our straightforward pricing plans are tailored to meet you needs. If you&apos;re not
          <br />
          ready to commit you can get started for free.
        </p>

        <PricingCards />
      </section>
    </>
  )
}

export default SitePage

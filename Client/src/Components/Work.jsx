const steps = [
  {
    number: '01',
    title: 'Describe the component',
    summary: 'Write the component name and what it should do.',
    detail: 'Add a short prompt, then define the layout or style direction so the generator understands the goal.',
  },
  {
    number: '02',
    title: 'Customize the output',
    summary: 'Adjust colors, spacing, and props before generating.',
    detail: 'Fine-tune the component behavior and appearance to match your product and design system.',
  },
  {
    number: '03',
    title: 'Generate the UI',
    summary: 'Let the AI create the initial version.',
    detail: 'The system produces a ready-to-review implementation that can be refined or copied directly.',
  },
  {
    number: '04',
    title: 'Use it in your app',
    summary: 'Copy, export, and ship the result.',
    detail: 'Take the final component into your project and reuse it wherever you need a consistent interface.',
  },
]

import { motion } from 'motion/react'

const Work = () => {
  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.12 }} className='px-6 py-16 sm:px-10 lg:px-28'>
      <div className='mx-auto flex max-w-6xl flex-col justify-center'>
        <p className='mx-auto rounded-full border border-cyan-400/10 bg-cyan-400/10 px-3 py-1 uppercase tracking-widest text-cyan-500'>
          Simple Process
        </p>

        <h1 className='mt-8 text-center text-4xl font-bold text-white'>How It Works?</h1>

        <div className='relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4'>
          <div className='absolute left-[12.5%] right-[12.5%] top-9 hidden h-px bg-linear-to-r from-transparent via-[#3be8ff]/25 to-transparent xl:block' />

          {steps.map((step, i) => (
            <motion.article
              key={step.number}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className='relative z-10 rounded-2xl border border-white/10 bg-white/5 px-6 pb-6 pt-10 text-center shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-sm'
            >
              <div className='absolute left-1/2 top-0 flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/20 bg-slate-950 text-lg font-extrabold text-cyan-300 shadow-[0_0_0_8px_rgba(59,232,255,0.05)]'>
                {step.number}
              </div>

              <h3 className='text-xl font-semibold text-white'>{step.title}</h3>
              <p className='mt-3 text-sm leading-6 text-slate-300'>{step.summary}</p>
              <p className='mt-3 text-sm leading-6 text-slate-400'>{step.detail}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default Work

import { motion } from 'motion/react'

const features = [
  {
    title: 'AI Component Generation',
    description: 'Create polished UI components from simple prompts and structured inputs.',
  },
  {
    title: 'Custom Styling Controls',
    description: 'Adjust spacing, colors, states, and layout details to match your design system.',
  },
  {
    title: 'Reusable UI Blocks',
    description: 'Build once and reuse across pages with consistent patterns and fast iteration.',
  },
  {
    title: 'Authentication Flow',
    description: 'Connect users through a smooth sign-in flow before they generate content.',
  },
  {
    title: 'Download and Copy Code',
    description: 'Move from concept to implementation with code export and asset download support.',
  },
  {
    title: 'Responsive Layouts',
    description: 'Every component is planned to behave well on desktop, tablet, and mobile screens.',
  },
]

const Inside = () => {
  return (
    <section className='mt-16 px-6 pb-8'>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className='mx-auto max-w-6xl rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_34%),linear-gradient(180deg,rgba(8,15,23,0.96),rgba(5,10,16,0.98))] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] sm:p-10'
      >
        <div className='mx-auto flex max-w-3xl flex-col items-center text-center'>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className='inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300'
          >
            Inside Me
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className='mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl'
          >
            Everything You Need Is{' '}
            <span className='bg-linear-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              Inside
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className='mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base'
          >
            A curated set of features that powers the full workflow of the website, from generating UI to signing in,
            copying code, and shipping responsive components.
          </motion.p>
        </div>

        <div className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{ duration: 0.45, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6, scale: 1.01 }}
              className='group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 backdrop-blur-sm'
            >
              <div className='absolute inset-0 bg-linear-to-br from-cyan-400/0 via-cyan-400/0 to-cyan-400/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
              <div className='relative flex items-start gap-4'>
                <div className='flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-300 ring-1 ring-cyan-400/20'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                  </svg>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-white'>{feature.title}</h3>
                  <p className='mt-2 text-sm leading-6 text-slate-300'>{feature.description}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>

  )
}

export default Inside

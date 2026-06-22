import { ArrowUpRight, Code2, Globe, Mail } from 'lucide-react'
import { motion } from 'motion/react'

const quickLinks = [
	{ label: 'Home', href: '#/' },
	{ label: 'Generate', href: '#/generate' },
	{ label: 'Components', href: '#components' },
	{ label: 'Auth', href: '#auth' },
]

const resources = [
	{ label: 'About the library', href: '#about' },
	{ label: 'Documentation', href: '#docs' },
	{ label: 'Credits system', href: '#credits' },
	{ label: 'Download assets', href: '#assets' },
]

const Footer = () => {
	return (
		<motion.footer initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.08 }} transition={{ duration: 0.6 }} className='relative mt-16 overflow-hidden border-t border-white/10 bg-[#041015] text-white'>
			<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,232,255,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_24%)]' />

			<div className='relative mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12'>
				<div className='grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]'>
					<div>
						<div className='flex items-center gap-3'>
							<div className='rounded-2xl bg-cyan-400/15 p-2 ring-1 ring-cyan-400/20'>
								<img src='/img.png' alt='Virtual Ui logo' className='h-10 w-10 object-contain' />
							</div>
							<div>
								<p className='text-lg font-bold tracking-tight'>Virtual Ui</p>
								<p className='text-xs uppercase tracking-[0.26em] text-cyan-300/80'>AI Powered UI Library</p>
							</div>
						</div>

						<p className='mt-5 max-w-md text-sm leading-6 text-slate-300'>
							Build, customize, and ship modern UI components faster with AI-powered generation, smooth workflows,
							and a clean system that fits your product.
						</p>

						<div className='mt-6 flex items-center gap-3'>
							{[
								{ icon: Globe, href: '#', label: 'Website' },
								{ icon: Code2, href: '#', label: 'Code' },
								{ icon: Mail, href: 'mailto:hello@virtualui.dev', label: 'Email' },
							].map((item) => {
								const Icon = item.icon

								return (
									<a
										key={item.label}
										href={item.href}
										aria-label={item.label}
										className='inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 transition-all hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300'
									>
										<Icon size={17} />
									</a>
								)
							})}
						</div>
					</div>

					<div>
						<h3 className='text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300'>Quick Links</h3>
						<ul className='mt-5 space-y-3 text-sm text-slate-300'>
							{quickLinks.map((link) => (
								<li key={link.label}>
									<a className='inline-flex items-center gap-2 transition-colors hover:text-cyan-300' href={link.href}>
										<ArrowUpRight size={14} />
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300'>Resources</h3>
						<ul className='mt-5 space-y-3 text-sm text-slate-300'>
							{resources.map((item) => (
								<li key={item.label}>
									<a className='inline-flex items-center gap-2 transition-colors hover:text-cyan-300' href={item.href}>
										<ArrowUpRight size={14} />
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className='text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300'>Stay Updated</h3>
						<p className='mt-5 text-sm leading-6 text-slate-300'>
							Get updates on new components, design improvements, and generation features.
						</p>

						<motion.div
							whileHover={{ y: -2 }}
							transition={{ duration: 0.2 }}
							className='mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2'
						>
							<input
								type='email'
								placeholder='Enter your email'
								className='min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500'
							/>
							<button className='inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-cyan-300'>
								Join
								<ArrowUpRight size={16} />
							</button>
						</motion.div>
					</div>
				</div>

				<div className='mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between'>
					<p>© 2026 Virtual Ui. All rights reserved.</p>
					<p className='text-slate-500'>Designed for fast AI-driven component workflows.</p>
				</div>
			</div>
		</motion.footer>
	)
}

export default Footer

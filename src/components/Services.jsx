import { motion } from 'framer-motion'
import ArchiveSectionChrome from './ui/ArchiveSectionChrome'

const services = [
  { num: '01', title: 'Creative Direction', desc: 'Shaping visual narratives across mediums, from concept through execution.' },
  { num: '02', title: 'Brand Systems', desc: 'Building cohesive identity systems that communicate purpose and distinction.' },
  { num: '03', title: 'Technical Design', desc: 'Bridging design and engineering with production-ready interactive experiences.' },
  { num: '04', title: 'AI-Integrated Workflows', desc: 'Embedding generative AI tools into creative production pipelines seamlessly.' },
  { num: '05', title: 'Audio Production', desc: 'Composing, mixing, and engineering soundscapes for film, brands, and installations.' },
  { num: '06', title: 'Visual Design', desc: 'Crafting editorial, packaging, and campaign imagery with obsessive attention to detail.' },
]

export default function Services() {
  return (
    <section className="section" id="services">
      <div className="section__container">
        <ArchiveSectionChrome 
          index="02" 
          label="CAPABILITIES" 
          title="Services" 
        />

        <div className="services-grid">
          {services.map((svc, i) => (
            <motion.div
              key={svc.num}
              className="service-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ borderColor: 'var(--border-hover)', y: -3 }}
            >
              <span className="service-card__number mono-tag" style={{ color: 'var(--accent-marker)' }}>{svc.num}</span>
              <h3 className="service-card__title">{svc.title}</h3>
              <p className="service-card__desc">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

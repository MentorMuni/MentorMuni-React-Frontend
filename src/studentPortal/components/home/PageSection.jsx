import { motion, useReducedMotion } from 'framer-motion';
import { revealProps } from '../../motion';

export default function PageSection({ title, subtitle, children, className = '', id }) {
  const reduce = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={`stu-section ${className}`.trim()}
      {...revealProps(reduce)}
    >
      {title ? (
        <header className="stu-section__head">
          <h2 className="stu-section__title">{title}</h2>
          {subtitle ? <p className="stu-section__sub">{subtitle}</p> : null}
        </header>
      ) : null}
      <div className="stu-section__body">{children}</div>
    </motion.section>
  );
}

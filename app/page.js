import styles from "./page.module.css";
import Hero from  './components/section/hero'
import Sec2 from  './components/section/sec2'
import Sec3 from  './components/section/sec3'
import Sec4 from  './components/section/sec4'
import Sec5 from './components/section/sec5'
import Sec6 from './components/section/sec6'
import Sec7 from  './components/section/sec7'
import Sec8 from './components/section/sec8'
import Sec9 from  './components/section/sec9'
import Sec10 from './components/section/sec10'

export default function Home() {
  return (
    <div className={styles.page}>
        <Hero/>
        <Sec2/>
        <Sec3/>
        <Sec4/>
        <Sec5/>
        <Sec6/>
        <Sec7/>
        <Sec8/>
        <Sec9/>
        <Sec10/>
    </div>
  );
}

import About from '@/components/About'
import Awards from '@/components/Awards'
import Features from '@/components/Features'
import Intro from '@/components/Intro'
import Persons from '@/components/Persons'
import Request from '@/components/Request'
import Services from '@/components/Services'

import request1Img from '../images/request-1.png?png'
import request2Img from '../images/request-2.png?png'

export default function Home() {
  return (
    <>
      <Intro />
      <Services />
      <Features />
      <Request
        title="При фиксации брекетов на обе челюсти получи сертификат на 7000 рублей"
        src={request1Img}
      />
      <About />
      <Persons />
      <Awards />
      <Request
        title="Онлайн консультация специалиста по аудио и видео связи, Бесплатно."
        src={request2Img}
        className="mb-0"
      />
    </>
  )
}

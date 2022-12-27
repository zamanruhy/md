import './Features.css'

export default function Features() {
  return (
    <section class="features">
      <div class="features__container container">
        <h2 class="title features__title">Нам доверяют пациенты</h2>
        <div class="features__grid">
          <div class="feature">
            <div class="feature__number">1</div>
            <h3 class="feature__title">Честные цены, без хитрых уловок</h3>
            <div class="feature__desc">
              Фиксируем цены в&nbsp;плане лечения, не&nbsp;повышаем
              в&nbsp;процессе.
            </div>
          </div>
          <div class="feature">
            <div class="feature__number">2</div>
            <h3 class="feature__title">Опытные Врачи</h3>
            <div class="feature__desc">
              Врачи постоянно совершенствуются в&nbsp;своей специальности,
              несмотря на&nbsp;богатый опыт работы.
            </div>
          </div>
          <div class="feature">
            <div class="feature__number">3</div>
            <h3 class="feature__title">Комфортные условия</h3>
            <div class="feature__desc">
              Уютная обстановка и&nbsp;отзывчивый персонал сделают поход
              к&nbsp;стоматологу максимально приятным.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

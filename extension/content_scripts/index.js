const content_scripts = (() => {
  const keywordRegex = (() => {
    const invest = '证券,股票,交易,投资,期货,基金,债券,贵金属,选择权'.split(',')
    const investZh = '證券,股票,交易,投資,期貨,基金,債券,貴金屬,選擇權'.split(
      ','
    )

    const gamble = '赌,casino,众筹,一元购,拼拼购,娱乐场,娱乐城,娱乐平台,彩票,福彩,博彩,投注,炸金花,扎金花,百家乐,电子游艺,太阳城,返利,佣金,收益,日赚,提款,棋牌,操盘,澳门,葡京,六合彩,彩金,大发集团,威尼斯,拉斯维加斯,返水,反水,金沙,老虎机,'.split(
      ','
    )
    const gambleZh = '賭,casino,眾籌,一元購,拼拼購,娛樂場,娛樂城,娛樂平臺,彩票,福彩,博彩,投註,炸金花,紮金花,百家樂,電子遊藝,太陽城,返利,傭金,收益,日賺,提款,棋牌,操盤,澳門,葡京,六合彩,彩金,大發集團,威尼斯,拉斯維加斯,返水,反水,金沙,老虎機,'.split(
      ','
    )

    const load = '贷,信用,银行'.split(',')
    const loanZh = '貸,信用,銀行'.split(',')

    const keywords = []
      .concat(invest, investZh, gamble, gambleZh, load, loanZh)
      .filter(Boolean)

    return new RegExp(`(${keywords.join('|')})`, 'gim')
  })()

  const search = (regex, wnd = window) => {
    const title = wnd.document.title
    const body = wnd.document.documentElement.innerText

    const found = (title + body).split(regex).filter(p => regex.test(p))

    const dedupe = arr => {
      return Array.from(new Set(arr.values()))
    }
    return dedupe(found)
  }

  const prevent = (wnd = window) => {
    const doc = wnd.document
    if (doc.head) doc.head.innerHTML = ''
    if (doc.body) doc.body.innerHTML = ''
    doc.documentElement.innerHTML = `

    <style>
      html, body {
        width: 100vw;
        height: 100vh;
        display: flex;
        background: black;
        align-items: center;
        justify-content: center;
      }
    </style>

    <img src="https://cataas.com/cat/cute/says/no" alt="meow"/>

    `
  }

  let interval = 500
  const startMonitoring = () => {
    const monitor = () => {
      const found = search(keywordRegex, window)
      if (found.length >= 2) {
        console.warn('[bad-site] found dangerouse words:', found.join(','))
        prevent()
      } else {
        interval = interval * 2
        setTimeout(monitor, interval)
      }
    }
    monitor()
  }

  startMonitoring()
})()

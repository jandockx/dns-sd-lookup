const denodeify = require('denodeify')
const resolvePtr = denodeify(require('dns').resolvePtr)
const resolveSrv = denodeify(require('dns').resolveSrv)
const resolveTxt = denodeify(require('dns').resolveTxt)

function lookup (/* String */ serviceType) {
  // noinspection JSUnresolvedFunction
  return resolvePtr(serviceType).then(response => {
    // console.log(response)
    // noinspection JSUnresolvedFunction
    return Promise.all(
      response.map(ptr =>
        Promise.all([
          resolveSrv(ptr).then(srv => {
            // console.log(srv)
            /* istanbul ignore next : // MUDO */
            if (srv.length > 1) {
              const err = new Error('received more than 1 SRV record')
              err.name = ptr
              err.count = srv.length
              throw err
            }
            return srv[0]
          }),
          resolveTxt(ptr).then(txt => {
            // console.log(txt)
            /* istanbul ignore next : // MUDO */
            if (txt.length > 1) {
              const err = new Error('received more than 1 TXT record')
              err.name = ptr
              err.count = txt.length
              throw err
            }
  /*
            console.log(txt[0].reduce(
              (acc, str) => {
                acc += str.length
                return acc
              },
              0
            ))
  */
            return txt[0].reduce(
              (acc, r) => {
                const parts = r.split('=')
                const key = parts.shift()
                acc[key] = parts.join('=')
                return acc
              },
              {}
            )
          })
        ]).catch(/* istanbul ignore next : // MUDO */err => {
          console.error(err.message)
          throw err
        }).then(data => {
          // console.log(data)
          // console.log(data[1])
          return Object.assign(
            {
              type: serviceType,
              instance: ptr
            },
            data[0],
            data[1]
          )
        })
      )
    )
  })
}

module.exports = lookup

import Router from 'next/router'

const Index = () => null

Index.getInitialProps = async ({ res }) => {
    if (res) {
        res.writeHead(302, {
            Location: `/auth/login`
        })
        res.end()
    } 
    else
        Router.push(`/auth/login`)

    return {}
}

export default Index
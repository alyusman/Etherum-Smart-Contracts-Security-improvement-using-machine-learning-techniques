import { useRouter } from 'next/router'

function Redirect(props) {
  const router = useRouter()
  if (typeof window != 'undefined') {
    router.push(props.url)
  }
  return 0;
}

export default Redirect
import {useParams} from 'react-router-dom'
export default function BookingPage() {
  const {id} = useParams(0)
  return <div>Single booking: {id}</div>;
}

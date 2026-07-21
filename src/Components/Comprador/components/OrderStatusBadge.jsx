import Badge from '../../Shared/Badge'
import { ORDER_STATUS } from '../../../constants'

function OrderStatusBadge({ estado }) {
  const status = ORDER_STATUS[estado] || { label: estado, color: 'slate' }
  return <Badge color={status.color}>{status.label}</Badge>
}

export default OrderStatusBadge

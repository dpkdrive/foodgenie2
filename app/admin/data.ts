export type OrderStatus = 'Active' | 'Paused' | 'Completed' | 'Cancelled'
export type PlanType   = 'Balanced Food' | 'Low Calorie & High Protein' | 'Bespoke Package'

export interface Order {
  id:        string
  customer:  string
  phone:     string
  email:     string
  plan:      PlanType
  planType:  'Fixed' | 'Customized' | 'Bespoke'
  category:  string
  meals:     string
  startDate: string
  endDate:   string
  amount:    number
  status:    OrderStatus
  address:   string
}

export const ORDERS: Order[] = [
  { id:'FG-001', customer:'Riya Kapoor',    phone:'9810123456', email:'riya@gmail.com',   plan:'Balanced Food',               planType:'Fixed',       category:'Balanced',                      meals:'Lunch',     startDate:'2025-06-01', endDate:'2025-06-28', amount:8500,  status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-002', customer:'Amit Sharma',    phone:'9820234567', email:'amit@gmail.com',   plan:'Low Calorie & High Protein',  planType:'Fixed',       category:'High Protein Low Calories',     meals:'Lunch',     startDate:'2025-06-03', endDate:'2025-06-09', amount:2800,  status:'Completed', address:'Sector 57, Gurugram' },
  { id:'FG-003', customer:'Neha Verma',     phone:'9830345678', email:'neha@gmail.com',   plan:'Bespoke Package',             planType:'Bespoke',     category:'Bespoke — Vegan',               meals:'Dinner',    startDate:'2025-06-05', endDate:'2025-07-02', amount:14000, status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-004', customer:'Rohan Mehta',    phone:'9840456789', email:'rohan@gmail.com',  plan:'Balanced Food',               planType:'Fixed',       category:'Balanced',                      meals:'Lunch',     startDate:'2025-05-15', endDate:'2025-06-11', amount:5200,  status:'Completed', address:'Sector 57, Gurugram' },
  { id:'FG-005', customer:'Priya Singh',    phone:'9850567890', email:'priya@gmail.com',  plan:'Low Calorie & High Protein',  planType:'Customized',  category:'High Protein Low Calories',     meals:'Dinner',    startDate:'2025-06-10', endDate:'2025-07-07', amount:9800,  status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-006', customer:'Karan Malhotra', phone:'9860678901', email:'karan@gmail.com',  plan:'Balanced Food',               planType:'Fixed',       category:'Balanced',                      meals:'Lunch',     startDate:'2025-06-12', endDate:'2025-06-18', amount:2100,  status:'Paused',    address:'Sector 57, Gurugram' },
  { id:'FG-007', customer:'Sunita Rao',     phone:'9870789012', email:'sunita@gmail.com', plan:'Bespoke Package',             planType:'Bespoke',     category:'Bespoke — Bride to be',         meals:'Breakfast', startDate:'2025-05-01', endDate:'2025-05-28', amount:13500, status:'Completed', address:'Sector 57, Gurugram' },
  { id:'FG-008', customer:'Vikram Nair',    phone:'9880890123', email:'vikram@gmail.com', plan:'Low Calorie & High Protein',  planType:'Fixed',       category:'High Protein Low Calories',     meals:'Lunch',     startDate:'2025-06-14', endDate:'2025-07-11', amount:5600,  status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-009', customer:'Anjali Gupta',   phone:'9890901234', email:'anjali@gmail.com', plan:'Balanced Food',               planType:'Customized',  category:'Balanced',                      meals:'Dinner',    startDate:'2025-06-08', endDate:'2025-07-05', amount:8200,  status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-010', customer:'Deepak Joshi',   phone:'9900012345', email:'deepak@gmail.com', plan:'Bespoke Package',             planType:'Bespoke',     category:'Bespoke — Athletes',            meals:'Breakfast', startDate:'2025-06-01', endDate:'2025-06-28', amount:14500, status:'Cancelled', address:'Sector 57, Gurugram' },
  { id:'FG-011', customer:'Meera Pillai',   phone:'9910123456', email:'meera@gmail.com',  plan:'Low Calorie & High Protein',  planType:'Fixed',       category:'High Protein Low Calories',     meals:'Lunch',     startDate:'2025-06-15', endDate:'2025-07-12', amount:9200,  status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-012', customer:'Arun Kumar',     phone:'9920234567', email:'arun@gmail.com',   plan:'Balanced Food',               planType:'Customized',  category:'Balanced',                      meals:'Dinner',    startDate:'2025-06-02', endDate:'2025-06-29', amount:5000,  status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-013', customer:'Pooja Arora',    phone:'9930345678', email:'pooja@gmail.com',  plan:'Balanced Food',               planType:'Fixed',       category:'Balanced',                      meals:'Lunch',     startDate:'2025-05-20', endDate:'2025-06-16', amount:8000,  status:'Completed', address:'Sector 57, Gurugram' },
  { id:'FG-014', customer:'Sanjay Tiwari',  phone:'9940456789', email:'sanjay@gmail.com', plan:'Bespoke Package',             planType:'Bespoke',     category:'Bespoke — Diabetes',            meals:'Breakfast', startDate:'2025-06-16', endDate:'2025-07-13', amount:14200, status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-015', customer:'Kavita Shah',    phone:'9950567890', email:'kavita@gmail.com', plan:'Low Calorie & High Protein',  planType:'Fixed',       category:'High Protein Low Calories',     meals:'Lunch',                                        startDate:'2025-06-05', endDate:'2025-06-11', amount:2600,  status:'Paused',    address:'Sector 57, Gurugram' },
  { id:'FG-016', customer:'Aditi Sharma',   phone:'9960123456', email:'aditi@gmail.com',  plan:'Bespoke Package',                     planType:'Bespoke',     category:'Bespoke — Bride to be',         meals:'Breakfast · Lunch · Snacks · Dinner', startDate:'2025-07-01', endDate:'2025-07-28', amount:41160, status:'Active',    address:'Sector 57, Gurugram' },
  { id:'FG-017', customer:'Prerna Malhotra',phone:'9970234567', email:'prerna@gmail.com', plan:'Bespoke Package',                     planType:'Bespoke',     category:'Bespoke — Bride to be',         meals:'Breakfast · Lunch · Snacks · Dinner', startDate:'2025-06-20', endDate:'2025-09-11', amount:119079, status:'Active',   address:'Sector 57, Gurugram' },
  { id:'FG-018', customer:'Ritika Oberoi',  phone:'9980345678', email:'ritika@gmail.com', plan:'Bespoke Package',                     planType:'Bespoke',     category:'Bespoke — Bride to be',         meals:'Breakfast · Lunch · Snacks · Dinner', startDate:'2025-05-10', endDate:'2025-06-06', amount:41160, status:'Completed', address:'Sector 57, Gurugram' },
]

export const ADMIN_EMAIL    = 'admin@foodgenie.com'
export const ADMIN_PASSWORD = 'foodgenie@2025'

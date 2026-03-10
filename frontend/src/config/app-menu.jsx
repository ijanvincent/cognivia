const Menu = [
  { 
    path: '/admin/dashboard', 
    icon: 'fa fa-th-large', 
    title: 'Dashboard' 
  },
  { 
    path: '/admin/users', 
    icon: 'fa fa-users', 
    title: 'User Management',
    children: [
      { path: '/admin/users', title: 'All Users' },
      { path: '/admin/users/analytics', title: 'User Analytics' },
    ]
  },
];

export default Menu;
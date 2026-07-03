USE makerhub_db;

-- Populate Categories
INSERT INTO categories (id, name) VALUES
(1, 'Bicicletas'),
(2, 'Accesorios'),
(3, 'Herramientas'),
(4, 'Componentes')
ON DUPLICATE KEY UPDATE name=name;

-- Populate Products
INSERT INTO products (id, title, price, description, image, categoryId, colors) VALUES
(1, 'Bicicleta Urbana MTB', 45000.00, 'Bicicleta de montaña robusta, ideal para caminos difíciles y terrenos irregulares. Suspensión delantera de 100mm, frenos de disco hidráulicos.', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 1, 'Negro, Rojo, Azul'),
(2, 'Casco Deportivo Pro', 8500.00, 'Casco ligero con protección avanzada. Diseño aerodinámico, ventilación óptima y certificación de seguridad internacional.', 'https://images.unsplash.com/photo-1629366303168-0f83891b1377?w=500', 2, 'Blanco, Gris, Naranja'),
(3, 'Luces LED Recargables', 3200.00, 'Juego de luces frontal y trasera LED. Batería recargable por USB, 8 modos de iluminación, muy visible de noche.', 'https://images.unsplash.com/photo-1505798577917-4a376de3e674?w=500', 2, 'Rojo, Negro'),
(4, 'Candado U de Seguridad', 5800.00, 'Candado en forma de U fabricado en acero templado. Resistente al corte, cierre rápido con llave. Ideal para ciudad.', 'https://images.unsplash.com/photo-1549465220-acada08988b7?w=500', 2, 'Negro, Plateado'),
(5, 'Pump Manual de Aire', 2200.00, 'Bomba portátil para inflar llantas. Compatible con valvulas Presta y Schrader. Compacta y fácil de llevar en mochila.', 'https://images.unsplash.com/photo-1552748814-4851621f0eaa?w=500', 3, 'Azul, Negro, Verde'),
(6, 'Sillín Gel Comfort', 4500.00, 'Sillín ergonómico con gel de memoria. Acolchonado premium para viajes largos sin molestias. Fácil instalación.', 'https://images.unsplash.com/photo-1575092918484-dbb8b36cebee?w=500', 4, 'Negro, Marrón'),
(7, 'Pedales Antideslizantes', 6200.00, 'Pedales de aluminio con plataforma antideslizante. Reflectores integrados, muy seguros para uso nocturno.', 'https://images.unsplash.com/photo-1570803387584-86496797e8c9?w=500', 4, 'Gris, Negro'),
(8, 'Espejo Retrovisor Giratorio', 1900.00, 'Espejo de seguridad ajustable para manillar. Permite ver el tráfico trasero sin girar la cabeza. Muy ligero.', 'https://images.unsplash.com/photo-1555626906-fcf10d6851a7?w=500', 2, 'Negro, Plata')
ON DUPLICATE KEY UPDATE title=VALUES(title), price=VALUES(price), description=VALUES(description), image=VALUES(image), categoryId=VALUES(categoryId), colors=VALUES(colors);

-- Populate Users (password for all is '123456' hashed with bcrypt)
INSERT INTO users (id, firstName, lastName, email, password, category, image) VALUES
(1, 'Admin', 'User', 'admin@makerhub.com', '$2b$10$fTpsAvif9tO.Rgl0fUae9uALogc.NaQP9gFst.613W4DKYGUGjlZ6', 'admin', null),
(2, 'Regular', 'User', 'user@makerhub.com', '$2b$10$fTpsAvif9tO.Rgl0fUae9uALogc.NaQP9gFst.613W4DKYGUGjlZ6', 'user', null),
(3, 'Emanuel', 'Pontoni', 'pontoni.emanuel@gmail.com', '$2b$10$fTpsAvif9tO.Rgl0fUae9uALogc.NaQP9gFst.613W4DKYGUGjlZ6', 'admin', '/public/images/users/placeholder.png')
ON DUPLICATE KEY UPDATE firstName=VALUES(firstName), lastName=VALUES(lastName), password=VALUES(password), category=VALUES(category), image=VALUES(image);

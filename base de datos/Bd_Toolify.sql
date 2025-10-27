CREATE TABLE TB_DISTRITO (
    ID_DISTRITO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL
);

CREATE TABLE TB_CATEGORIA (
    ID_CATEGORIA SERIAL PRIMARY KEY,
    DESCRIPCION VARCHAR(25) NOT NULL
);

CREATE TABLE TB_ROL (
    ID_ROL SERIAL PRIMARY KEY,
    DESCRIPCION CHAR(1) NOT NULL
);

CREATE TABLE TB_USUARIO (
    ID_USUARIO SERIAL PRIMARY KEY,
    NOMBRES VARCHAR(50) NOT NULL,
    APE_MATERNO VARCHAR(50) NOT NULL,
    APE_PATERNO VARCHAR(50) NOT NULL,
    CORREO VARCHAR(50) UNIQUE NOT NULL,
    CLAVE VARCHAR(255) NOT NULL,
    NRO_DOC VARCHAR(15) UNIQUE NOT NULL,
    DIRECCION VARCHAR(70),
    ID_DISTRITO INT NOT NULL,
    TELEFONO CHAR(9) NOT NULL,
    ROL INT DEFAULT 2,
    FECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ESTADO BOOLEAN DEFAULT TRUE,
    FCM_TOKEN VARCHAR(500) NULL,
    FCM_TOKEN_FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_DISTRITO) REFERENCES TB_DISTRITO(ID_DISTRITO),
    FOREIGN KEY (ROL) REFERENCES TB_ROL(ID_ROL)
);

CREATE TABLE TB_PROVEEDOR (
    ID_PROVEEDOR SERIAL PRIMARY KEY,
    RUC CHAR(11) NOT NULL,
    RAZON_SOCIAL VARCHAR(100) NOT NULL,
    TELEFONO CHAR(15) NOT NULL,
    DIRECCION VARCHAR(80) NOT NULL,
    ID_DISTRITO INT NOT NULL,
    FECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ESTADO BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ID_DISTRITO) REFERENCES TB_DISTRITO(ID_DISTRITO)
);

CREATE TABLE TB_PRODUCTO (
    ID_PRODUCTO SERIAL PRIMARY KEY,
    NOMBRE VARCHAR(50) NOT NULL,
    DESCRIPCION VARCHAR(100) NOT NULL,
    ID_PROVEEDOR INT,
    ID_CATEGORIA INT,
    PRECIO NUMERIC(10,2) NOT NULL,
    STOCK INT DEFAULT 1 NOT NULL,
    IMAGEN BYTEA NULL, --cambiando a null para q registre
    FECHA_REGISTRO TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ESTADO BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ID_PROVEEDOR) REFERENCES TB_PROVEEDOR(ID_PROVEEDOR),
    FOREIGN KEY (ID_CATEGORIA) REFERENCES TB_CATEGORIA(ID_CATEGORIA)
);

CREATE TABLE TB_VENTA (
    ID_VENTA SERIAL PRIMARY KEY,
    ID_USUARIO INT,
    FECHA TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TOTAL NUMERIC(11,2),
    ESTADO CHAR(1) DEFAULT 'G', -- G,P,E,C
    TIPO_VENTA CHAR(1) DEFAULT 'R', -- R, P
    METODO_ENTREGA CHAR(1), -- S, D
	ESPECIFICACIONES TEXT,
    CONSTRAINT EST_CHECK CHECK (ESTADO IN ('G','P','E','C')),
    CONSTRAINT TIPO_VENTA_CHECK CHECK (TIPO_VENTA IN ('P','R')),
    CONSTRAINT MET_ENTREGA_CHECK CHECK (METODO_ENTREGA IN ('D','S') OR METODO_ENTREGA IS NULL),
    FOREIGN KEY (ID_USUARIO) REFERENCES TB_USUARIO(ID_USUARIO)
);

CREATE TABLE TB_DETALLE_VENTA (
    ID_DETALLE_VENTA SERIAL PRIMARY KEY,
    ID_VENTA INT NOT NULL,
    ID_PRODUCTO INT NOT NULL,
    CANTIDAD SMALLINT NOT NULL,
    SUB_TOTAL NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (ID_VENTA) REFERENCES TB_VENTA(ID_VENTA),
    FOREIGN KEY (ID_PRODUCTO) REFERENCES TB_PRODUCTO(ID_PRODUCTO)
);

CREATE TABLE TB_PEDIDO (
    ID_PEDIDO SERIAL PRIMARY KEY,
    ID_VENTA INT NOT NULL UNIQUE,
    FECHA_CREACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DIRECCION_ENTREGA VARCHAR(255) NOT NULL,
    LATITUD NUMERIC(10,6) NOT NULL,
    LONGITUD NUMERIC(10,6) NOT NULL,
    NUMERO_PEDIDO VARCHAR(50) NOT NULL UNIQUE,
    QR_VERIFICATION_CODE VARCHAR(150) NOT NULL UNIQUE,
    ID_REPARTIDOR INT,
    MOVILIDAD CHAR(1) NOT NULL,
    FECHA_ASIGNACION TIMESTAMP,            -- momento en el q se setea el estado a AS
    FECHA_EN_CAMINO TIMESTAMP,             -- momento en el q se setea el estado a EC
    FECHA_ENTREGA TIMESTAMP,               -- momento en el q se setea el estado a EN
    TIEMPO_ENTREGA_MINUTOS SMALLINT,       -- métrica de negocio (dif d minutos entre EN y EC)
    ESTADO VARCHAR(2) DEFAULT 'PE',
    OBSERVACIONES TEXT,
    FOREIGN KEY (ID_VENTA) REFERENCES TB_VENTA(ID_VENTA),
    FOREIGN KEY (ID_REPARTIDOR) REFERENCES TB_USUARIO(ID_USUARIO),
    CONSTRAINT CHK_ESTADO_PEDIDO CHECK (ESTADO IN ('PE','AS','EC','CR','EN','FA')),
    CONSTRAINT CHK_MOVILIDAD CHECK (MOVILIDAD IN ('M', 'A'))
	--leyenda de estados
	--PE -> PENDIENTE
	--AS -> ASIGNADO(aceptado) 
	--EC -> EN CAMINO
	--CR -> CERCA
	--EN -> ENTREGADO
	--FA -> FALLIDO
);

CREATE TABLE TB_CALIFICACION (
    ID_CALIFICACION SERIAL PRIMARY KEY,
    ID_PEDIDO INT NOT NULL UNIQUE,
    ID_CLIENTE INT NOT NULL,
    ID_REPARTIDOR INT NOT NULL,
    PUNTUACION SMALLINT,
    COMENTARIO TEXT,
    FECHA_CALIFICACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_PEDIDO) REFERENCES TB_PEDIDO(ID_PEDIDO),
    FOREIGN KEY (ID_CLIENTE) REFERENCES TB_USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_REPARTIDOR) REFERENCES TB_USUARIO(ID_USUARIO),
    CONSTRAINT CHK_PUNTUACION CHECK (PUNTUACION BETWEEN 1 AND 5)
);

CREATE TABLE TB_NOTIFICACIONES (
    ID_NOTIFICACION SERIAL PRIMARY KEY,
    ID_CLIENTE INT NOT NULL,
    ID_PEDIDO INT NOT NULL,
	TIPO VARCHAR(50) NOT NULL,
	FECHA_CREACION TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LEIDA BOOLEAN DEFAULT FALSE,
    DESCARTADA BOOLEAN DEFAULT FALSE,         -- Indica si el usuario la eliminó de su listado

    FOREIGN KEY (ID_CLIENTE) REFERENCES TB_USUARIO(ID_USUARIO),
    FOREIGN KEY (ID_PEDIDO) REFERENCES TB_PEDIDO(ID_PEDIDO),

	CONSTRAINT CHK_TIPO_NOTIFICACION CHECK (TIPO IN (
        'PEDIDO_PENDIENTE',
        'PEDIDO_ACEPTADO',
        'PEDIDO_EN_CAMINO',
        'PEDIDO_CERCA',
        'PEDIDO_ENTREGADO',
        'PEDIDO_FALLIDO'
    ))
);

CREATE INDEX IDX_NOTI_CLIENTE ON TB_NOTIFICACIONES (ID_CLIENTE);
-- Buscar notificaciones de un cliente que NO han sido descartadas.
CREATE INDEX IDX_NOTI_CLIENTE_DESCARTADA ON TB_NOTIFICACIONES (ID_CLIENTE, DESCARTADA);
-- notificaciones no leídas por cliente.
CREATE INDEX IDX_NOTI_CLIENTE_LEIDA ON TB_NOTIFICACIONES (ID_CLIENTE, LEIDA);


-- INSERCCIONES

INSERT INTO TB_DISTRITO (NOMBRE) VALUES
('Ancón'),
('Ate'),
('Barranco'),
('Breña'),
('Carabayllo'),
('Chorrillos'),
('Comas'),
('La Molina'),
('Miraflores'),
('San Isidro');

INSERT INTO TB_CATEGORIA (DESCRIPCION) VALUES
('Drywall'),
('Fierro'),
('Puertas'),
('Taladros'),
('Compresoras'),
('Cables eléctricos'),
('Inodoros'),
('Tanques agua'),
('Porcelanatos'),
('Pisos cerámicos');

INSERT INTO TB_ROL (DESCRIPCION) VALUES
('A'), -- Administrador
('C'), -- Cliente
('V'), -- Vendedor
('R'); -- Repartidor


INSERT INTO TB_USUARIO (NOMBRES, APE_PATERNO, APE_MATERNO, CORREO, CLAVE, NRO_DOC, DIRECCION, ID_DISTRITO, TELEFONO, ROL)
VALUES
-- Registros existentes
('Luis','Pérez','García','luis.perez@example.com','clave123','12345678','Av. Lima 123',1,'987654321',1), --Administrador

('María','Ramírez','Lopez','maria.ramirez@example.com','clave123','23456789','Calle Real 456',2,'987654322',2), --Cliente 1
('Rebeca','Yllanes','Chavez','rebeca.yllanes@gmail.com','rebeca123','75454532','Av. Riva Agüero 345 ',3,'908955357',2),--Cliente  2
('Victor','Narazas','Garcia','victor.narazas@gmail.com','victor123','56876765','Av. Angamos 234',3,'928845092',2),--Cliente  3
('Carlos','Sánchez','Morales','carlos.sanchez@example.com','clave123','11223344','Av. Grau 789',3,'987654325',2), --cliente 4
('Elena','Huerta','Campos','elena.huerta@example.com','clave123','22334455','Jr. Las Flores 321',4,'987654326',2), --cliente 5
('Pedro','Mendoza','Cruz','pedro.mendoza@example.com','clave123','33445566','Av. Bolívar 987',2,'987654327',2), -- cliente 6

('Juan','Gonzales','Meza','juan.gonzales@example.com','clave123','34567890','Jr. Perú 789',3,'987654323',3), --Vendedor 1

('Ana','Torres','Díaz','ana.torres@example.com','clave123','45678901','Psje. Andino 012',4,'987654324',4), -- Repartidor 1
('Andy','Valdivia','Centeno','andy.centeno@gmail.com','andy123','76987423','Av. Riva Agüero 234',2,'937150514',4),--Repartidor 2
('Jose','Julca','Chumpitaz','jose.julca@gmail.com','jose123','75454531','Av. Inka Garcilaso de la Vega 123',2,'986425458',4),--Repartidor 3
('Jorge','Rojas','Vega','jorge.rojas@example.com','clave123','44556677','Calle Central 654',1,'987654328',4), --Repartidor 4
('Lucía','Campos','Reyes','lucia.campos@example.com','clave123','55667788','Jr. Los Álamos 159',3,'987654329',4), --Repartidor 5
('Rosa','Gutiérrez','Salas','rosa.gutierrez@example.com','clave123','66778899','Av. Primavera 753',2,'987654330',4); --Repartidor 6

INSERT INTO TB_PROVEEDOR (RUC, RAZON_SOCIAL, TELEFONO, DIRECCION, ID_DISTRITO)
VALUES
('20123456781','Ferretería El Maestro','014567890','Av. Constructores 123',1),
('20123456782','Construye Perú SAC','014567891','Jr. Obrero 456',2),
('20123456783','Materiales Lima SAC','014567892','Calle Industria 789',3),
('20123456784','Innova Construcción','014567893','Av. Diseño 101',4),
('20123456785','Proveedora Andina','014567894','Psje. Andino 202',5),
('20123456786','Equipamientos SAC','014567895','Calle Equipos 303',6),
('20123456787','Ferreval SAC','014567896','Av. Ferretería 404',7),
('20123456788','Metalúrgica Perú','014567897','Jr. Metal 505',8),
('20123456789','Cerámicos del Sur','014567898','Av. Sur 606',9),
('20123456790','Porcelanatos Lima','014567899','Calle Porcelana 707',10),
('20123456791','Soluciones Hidráulicas','014567800','Av. Agua 808',1),
('20123456792','Tanques & Cía','014567801','Jr. Tanque 909',2),
('20123456793','Electric Perú','014567802','Calle Luz 010',3),
('20123456794','Cables y Más SAC','014567803','Av. Cable 111',4),
('20123456795','Puertas Seguras SAC','014567804','Psje. Seguridad 222',5),
('20123456796','Taladros Perú','014567805','Calle Taladro 333',6),
('20123456797','Compresores SAC','014567806','Av. Compresor 444',7),
('20123456798','Drywall House','014567807','Jr. Drywall 555',8),
('20123456799','Fierro y Acero SAC','014567808','Av. Fierro 666',9),
('20123456800','Constructora Integral','014567809','Calle Construir 777',10);

INSERT INTO TB_PRODUCTO (NOMBRE, DESCRIPCION, ID_PROVEEDOR, ID_CATEGORIA, PRECIO, STOCK, IMAGEN) VALUES
('Panel Drywall 12mm', 'Panel estándar 1.20x2.44m', 1, 1, 45.50, 100, NULL),
('Panel Drywall 15mm', 'Panel reforzado 1.20x2.44m', 1, 1, 55.00, 80, NULL),
('Perfil U 3m', 'Perfil metálico U para drywall', 2, 1, 12.00, 200, NULL),
('Perfil C 3m', 'Perfil metálico C para drywall', 2, 1, 15.00, 150, NULL),
('Puerta Madera 0.80x2.00', 'Puerta interior MDF', 15, 3, 250.00, 50, NULL),
('Puerta Metal 0.90x2.00', 'Puerta metal reforzada', 15, 3, 350.00, 40, NULL),
('Taladro Percutor 650W', 'Taladro con martillo y brocas', 16, 4, 180.00, 60, NULL),
('Taladro Inalámbrico 18V', 'Taladro inalámbrico con batería', 16, 4, 440.00, 30, NULL),
('Compresor 50L', 'Compresor de aire 2 HP', 17, 5, 720.00, 25, NULL),
('Compresor 100L', 'Compresor industrial 3 HP', 17, 5, 920.00, 15, NULL),
('Cable Eléctrico 2.5mm²', 'Rollo cable cobre', 13, 6, 0.80, 500, NULL),
('Cable Eléctrico 4mm²', 'Rollo cable cobre', 13, 6, 1.20, 400, NULL),
('Inodoro Línea Premium', 'Inodoro cerámico con tapa', 9, 7, 360.00, 70, NULL),
('Inodoro Compacto', 'Inodoro cerámico compacto', 9, 7, 240.00, 90, NULL),
('Tanque Agua 300L', 'Tanque plástico vertical', 11, 8, 450.00, 35, NULL),
('Tanque Agua 500L', 'Tanque plástico vertical', 11, 8, 650.00, 20, NULL),
('Porcelanato 60x60cm', 'Porcelanato brillo gris', 10, 9, 75.00, 120, NULL),
('Porcelanato 80x80cm', 'Porcelanato satinado beige', 10, 9, 95.00, 80, NULL),
('Piso Cerámico 30x30cm', 'Cerámica interior lisa', 10, 10, 35.00, 150, NULL),
('Piso Cerámico 45x45cm', 'Cerámica interior diseño', 10, 10, 50.00, 100, NULL),
('Drywall Resistente a Humedad', 'Panel verde 12mm', 18, 1, 55.00, 90, NULL),
('Perfil Drywall Galva', 'Perfil galvanizado U 2.5m', 18, 1, 13.00, 180, NULL),
('Puerta de Seguridad', 'Puerta exterior acero', 15, 3, 980.00, 30, NULL),
('Puerta Corrediza 2.00m', 'Puerta corrediza madera', 15, 3, 420.00, 45, NULL),
('Taladro SDS 750W', 'Taladro SDS pro', 16, 4, 520.00, 35, NULL),
('Juego Brocas SDS', 'Set 10 brocas SDS', 16, 4, 75.00, 120, NULL),
('Mini Compresor Portátil', 'Compresor 10L portátil', 17, 5, 320.00, 40, NULL),
('Manguera 20m', 'Manguera para compresor', 17, 5, 45.00, 100, NULL),
('Cable Subterráneo 6mm²', 'Cable enrollable', 13, 6, 2.50, 300, NULL),
('Cable Subterráneo 10mm²', 'Cable enrollable', 13, 6, 4.00, 200, NULL),
('Inodoro Ducha Bidet', 'Inodoro con bidet', 9, 7, 480.00, 60, NULL),
('Lavatricero Completo', 'Lavatorio y mueble', 9, 7, 560.00, 40, NULL),
('Tanque Agua Horizontal 200L', 'Tanque plástico horizontal', 11, 8, 380.00, 30, NULL),
('Tanque Agua Horizontal 400L', 'Tanque plástico horizontal', 11, 8, 580.00, 20, NULL),
('Porcelanato Imitación Madera', 'Porcelanato 20x120cm', 10, 9, 120.00, 60, NULL),
('Porcelanato Imitación Mármol', 'Porcelanato 60x60cm', 10, 9, 140.00, 50, NULL),
('Piso Cerámico Antideslizante', 'Piso baño 30x30cm', 10, 10, 45.00, 130, NULL),
('Piso Cerámico Exterior', 'Piso rústico 30x30cm', 10, 10, 55.00, 110, NULL),
('Panel Drywall Fuego 12mm', 'Panel resistente fuego', 18, 1, 60.00, 70, NULL),
('Perfil F019 3m', 'Perfil galvanizado para terminación', 18, 1, 14.00, 160, NULL),
('Taladro Atornillador 14V', 'Taladro compacto', 16, 4, 320.00, 50, NULL),
('Taladro De Impacto 600W', 'Taladro compacto impacto', 16, 4, 210.00, 65, NULL),
('Compresor Industrial 150L', 'Compresor 5 HP', 17, 5, 1250.00, 10, NULL),
('Compresor Silencioso 24L', 'Compresor para pintura', 17, 5, 540.00, 25, NULL),
('Cable Flex 16mm²', 'Cable flexible enrollado', 13, 6, 6.50, 180, NULL),
('Cable Flex 25mm²', 'Cable flexible enrollado', 13, 6, 10.00, 120, NULL),
('Inodoro Smart Dual Flush', 'Inodoro doble descarga', 9, 7, 720.00, 50, NULL),
('Inodoro One Piece', 'Inodoro cerámico compacto', 9, 7, 480.00, 70, NULL),
('Tanque Agua Pressurizado 120L', 'Tanque con bomba', 11, 8, 780.00, 15, NULL),
('Tanque Agua Pressurizado 220L', 'Tanque con bomba', 11, 8, 980.00, 12, NULL),
('Porcelanato Gris Mate 60x120cm', 'Porcelanato gris mate', 10, 9, 160.00, 40, NULL),
('Porcelanato Blanco Brillo', 'Porcelanato blanco brillo 60x60', 10, 9, 150.00, 45, NULL),
('Piso Cerámico 60x60cm', 'Cerámica interior lisa', 10, 10, 65.00, 100, NULL);

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 17-02-2025 a las 23:09:50
-- Versión del servidor: 10.11.10-MariaDB
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u148646985_felusan`
--
CREATE DATABASE IF NOT EXISTS `felusan` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `felusan`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colores`
--

CREATE TABLE `colores` (
  `id` int(10) UNSIGNED NOT NULL,
  `color` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `colores`
--

INSERT INTO `colores` (`id`, `color`) VALUES
(1, 'Rojo'),
(2, 'Azul'),
(3, 'Beige'),
(4, 'Naranja'),
(5, 'Violeta'),
(6, 'Amarillo'),
(7, 'Gris'),
(8, 'Blanco'),
(9, 'Negro'),
(10, 'Marron'),
(11, 'Celeste'),
(12, 'Verde'),
(13, 'Fuksia'),
(14, 'Multicolor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `genero` char(1) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'Fecha y hora de subida',
  `prenda` varchar(255) NOT NULL,
  `tipo_id` int(10) UNSIGNED NOT NULL,
  `ofertado` tinyint(1) NOT NULL DEFAULT 0,
  `precio_oferta` decimal(10,0) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `genero`, `fecha`, `prenda`, `tipo_id`, `ofertado`, `precio_oferta`) VALUES
(15, 'Short Playero', '', 8000, 'M', '2024-12-23 15:14:15', 'short', 6, 0, 8000),
(16, 'Short Lino', '', 6500, 'F', '2024-12-23 15:24:28', 'short', 6, 0, 6500),
(17, 'Bermudas Lacoste', '', 9500, 'M', '2024-12-23 15:30:09', 'short', 6, 0, 9500),
(18, 'Bermuda NBA', '', 9500, 'M', '2024-12-23 15:36:17', 'short', 6, 0, 9500),
(19, 'Short algodón FLS', '', 8000, 'F', '2024-12-23 15:47:27', 'short', 6, 0, 8000),
(20, 'Remera VANS', '', 12000, 'M', '2024-12-23 15:53:11', 'remera', 1, 0, 12000),
(21, 'Camisas Lino', '', 15000, 'M', '2024-12-23 16:59:17', 'remera', 1, 0, 15000),
(22, 'Bermuda algodón FLS', '', 10000, 'M', '2024-12-23 17:51:09', 'bermuda', 10, 0, 10000),
(23, 'Remera Cherry', '', 5000, 'F', '2024-12-23 17:56:35', 'remera', 1, 0, 5000),
(24, 'Remera Michigan', '', 6000, 'F', '2024-12-23 18:03:44', 'remera', 1, 0, 6000),
(25, 'Short Sastrero', '', 9000, 'F', '2024-12-23 18:11:34', 'short', 8, 0, 9000),
(26, 'Boxer CK', '', 3500, 'M', '2024-12-23 18:20:44', 'short', 6, 0, 3500),
(28, 'Remeras Puperas', '', 6000, 'F', '2024-12-26 15:09:45', 'remera', 1, 0, 6000),
(29, 'Remera Entrenamiento ', '', 7500, 'X', '2024-12-26 15:19:43', 'remera', 1, 0, 7500),
(30, 'Musculosa Entrenamiento', '', 7000, 'X', '2024-12-26 15:20:41', 'remera', 3, 0, 7000),
(31, 'Musculosa FLS ', '', 8000, 'M', '2024-12-26 15:26:28', 'remera', 3, 0, 8000),
(32, 'Short Entrenamiento', '', 9000, 'M', '2024-12-26 15:30:46', 'short', 6, 0, 9000),
(33, 'Remera Morley ', '', 6500, 'F', '2024-12-26 15:31:59', 'remera', 1, 0, 6500),
(38, 'Remera Retro', '', 8500, 'X', '2024-12-26 15:43:47', 'remera', 1, 0, 8500),
(39, 'Jean Mom', '', 20000, 'F', '2024-12-26 16:33:49', 'jean', 5, 0, 20000),
(40, 'Jean Mom', '', 20000, 'F', '2024-12-26 16:34:59', 'jean', 5, 0, 20000),
(41, 'Boxer Tommy Hilfiger ', '', 3500, 'M', '2024-12-26 19:21:09', 'short', 6, 0, 3500),
(42, 'Remera Santa Cruz', '', 12000, 'X', '2024-12-26 19:37:36', 'remera', 1, 0, 12000),
(43, 'Remera FLS ', '', 6000, 'F', '2024-12-27 19:44:01', 'remera', 1, 0, 6000),
(44, 'Jean Cargo ', '', 20000, 'M', '2024-12-27 19:53:32', 'jean', 4, 0, 20000),
(47, 'Short Jean', '', 11000, 'F', '2024-12-27 20:27:03', 'short', 7, 0, 11000),
(49, 'Short Jean', '', 11000, 'F', '2024-12-27 20:39:45', 'short', 7, 0, 11000),
(51, 'Short Jean', '', 11000, 'F', '2024-12-27 21:06:40', 'jean', 7, 0, 11000),
(52, 'Short Sastrero', '', 9000, 'F', '2024-12-27 21:15:18', 'short', 8, 0, 9000),
(53, 'Remera Boxy Fit', '', 11000, 'M', '2024-12-27 21:37:00', 'remera', 9, 0, 11000),
(54, 'Bermuda Jean', '', 15000, 'M', '2025-01-27 15:26:26', 'jean', 11, 0, 15000),
(55, 'Remera I Love Amsterdam', '', 12000, 'M', '2025-02-17 17:18:06', 'remera', 2, 0, 12000),
(58, 'Body Morley ', '', 8500, 'F', '2025-02-17 17:40:39', 'remera', 1, 0, 8500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_fotos`
--

CREATE TABLE `producto_fotos` (
  `id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `color_id` int(10) UNSIGNED NOT NULL,
  `foto_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_fotos`
--

INSERT INTO `producto_fotos` (`id`, `producto_id`, `color_id`, `foto_url`) VALUES
(17, 15, 2, '/images/67697e472634f-WhatsApp Image 2024-12-23 at 11.43.46.jpeg'),
(18, 16, 10, '/images/676980ac454b4-WhatsApp Image 2024-12-23 at 11.43.47 (1).jpeg'),
(19, 17, 9, '/images/67698201d2759-WhatsApp Image 2024-12-23 at 11.43.47 (2).jpeg'),
(20, 18, 9, '/images/676983711457b-WhatsApp Image 2024-12-23 at 12.34.08.jpeg'),
(22, 20, 9, '/images/67698767f19c3-WhatsApp Image 2024-12-23 at 11.44.02.jpeg'),
(23, 21, 9, '/images/676996e585335-WhatsApp Image 2024-12-23 at 11.44.08.jpeg'),
(24, 22, 9, '/images/6769a30daf42b-WhatsApp Image 2024-12-23 at 11.44.12.jpeg'),
(25, 23, 9, '/images/6769a4531073c-IMG_1566 (1).jpeg'),
(27, 25, 9, '/images/6769a7d61a812-IMG_2024_12_18-17_09_21_7140_0E454405.jpeg'),
(28, 26, 1, '/images/6769a9fcbf871-WhatsApp Image 2024-12-23 at 15.13.10.jpeg'),
(31, 28, 1, '/images/676d71b96a33a-IMG-20241224-WA0062.jpg'),
(32, 28, 14, '/images/676d71b96a5f6-IMG-20241117-WA0056.jpg'),
(33, 29, 14, '/images/676d740f0a872-IMG-20241123-WA0062.jpg'),
(34, 30, 14, '/images/676d7449b0832-IMG-20241117-WA0123.jpg'),
(35, 31, 14, '/images/676d75a48c43e-IMG-20241117-WA0064.jpg'),
(36, 31, 14, '/images/676d75a48cf66-IMG-20241117-WA0072.jpg'),
(37, 32, 14, '/images/676d76a652c5f-IMG-20241117-WA0060.jpg'),
(38, 33, 14, '/images/676d76efaed7a-IMG-20241117-WA0052.jpg'),
(39, 38, 14, '/images/676d79b3a6be6-IMG-20241123-WA0076.jpg'),
(40, 38, 14, '/images/676d79b3a6ffd-IMG-20241123-WA0074.jpg'),
(41, 19, 10, '/images/676d7a9848529-50e96b6633c2ca39.jpg'),
(42, 19, 3, '/images/676d7a98489b4-fd658137ac911739.jpg'),
(43, 19, 12, '/images/676d7a9848d4d-913690484b517713.jpg'),
(44, 17, 14, '/images/676d7bc0023cf-6fcac8260540ea35.jpg'),
(45, 18, 14, '/images/676d7c05ccbb6-89f38df9b20a5b4c.jpg'),
(46, 39, 11, '/images/676d856d3f91b-IMG-20241226-WA0011.jpg'),
(47, 39, 11, '/images/676d856d3fbf2-IMG-20241226-WA0012.jpg'),
(48, 40, 2, '/images/676d85b303fec-IMG-20241226-WA0010.jpg'),
(49, 40, 2, '/images/676d85b3042f5-IMG-20241226-WA0009.jpg'),
(50, 24, 3, '/images/676d8a12e3e0e-8277fd3e0ed4f6b2.jpg'),
(51, 24, 9, '/images/676d8a12e4245-24dd8be5e4885746.jpg'),
(52, 24, 10, '/images/676d8a12e458d-f9038bc7d177c5b7.jpg'),
(53, 41, 8, '/images/676daca5e379c-IMG-20240811-WA0071(1).jpg'),
(54, 42, 9, '/images/676db080e9c8c-IMG-20240811-WA0070(2).jpg'),
(55, 43, 9, '/images/676f03818647c-d5bb0912-c2a0-41b5-8d1e-d102552d1eff.jpg'),
(56, 44, 9, '/images/676f05bc7a956-jean cargo.jpg'),
(57, 44, 9, '/images/676f05bc7b380-jean cargo 2.jpg'),
(67, 47, 2, '/images/676f0d9762e9b-short jean2.jpg'),
(68, 47, 2, '/images/676f0d976340a-short jean1.jpg'),
(71, 49, 9, '/images/676f109198157-short jean 5.jpg'),
(72, 49, 9, '/images/676f1091987e4-short jean 6.jpg'),
(75, 51, 11, '/images/676f16e0c9fb5-short jean 12.jpg'),
(76, 51, 11, '/images/676f16e0ca712-short jean 11.jpg'),
(77, 52, 9, '/images/676f18e66af7e-short jean 13.jpg'),
(80, 53, 14, '/images/676f205673db4-d6dd4b53383b8e02.jpg'),
(81, 53, 3, '/images/676f2056749b8-b67120fd882f579d.jpg'),
(82, 53, 8, '/images/676f2056750d3-2d42c2f082351c15.jpg'),
(83, 21, 8, '/images/6797a4fd17307-ba12ffad434ea725.jpg'),
(84, 21, 3, '/images/6797a4fd188ba-4e99b4ef0ad3ded9.jpg'),
(85, 54, 9, '/images/6797a5a2c4c04-IMG-20241228-WA0063(1).jpg'),
(86, 55, 9, '/images/67b36f4eb355b-IMG-20250216-WA1140.jpg'),
(87, 55, 9, '/images/67b36f4eb387b-IMG-20250216-WA0803.jpg'),
(88, 58, 8, '/images/67b37497c0527-IMG-20250217-WA0086.jpg'),
(89, 58, 9, '/images/67b37497c0e16-IMG-20250217-WA0092.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_variantes`
--

CREATE TABLE `producto_variantes` (
  `id` int(10) UNSIGNED NOT NULL,
  `producto_id` int(10) UNSIGNED NOT NULL,
  `color_id` int(10) UNSIGNED NOT NULL,
  `talle_id` int(10) UNSIGNED NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_variantes`
--

INSERT INTO `producto_variantes` (`id`, `producto_id`, `color_id`, `talle_id`, `stock`) VALUES
(130, 20, 9, 1, 5),
(131, 20, 9, 2, 5),
(132, 20, 9, 3, 5),
(133, 20, 9, 4, 5),
(134, 20, 9, 5, 5),
(135, 20, 8, 1, 5),
(136, 20, 8, 2, 5),
(137, 20, 8, 3, 5),
(138, 20, 8, 4, 5),
(139, 20, 8, 5, 5),
(140, 20, 12, 1, 5),
(141, 20, 12, 2, 5),
(142, 20, 12, 3, 5),
(143, 20, 12, 4, 5),
(144, 20, 12, 5, 5),
(145, 20, 1, 1, 5),
(146, 20, 1, 2, 5),
(147, 20, 1, 3, 5),
(148, 20, 1, 4, 5),
(149, 20, 1, 5, 5),
(150, 20, 2, 1, 5),
(151, 20, 2, 2, 5),
(152, 20, 2, 3, 5),
(153, 20, 2, 4, 5),
(154, 20, 2, 5, 5),
(171, 22, 9, 1, 5),
(172, 22, 9, 2, 5),
(173, 22, 9, 3, 5),
(174, 22, 9, 4, 5),
(175, 22, 9, 5, 5),
(176, 22, 9, 6, 5),
(177, 23, 9, 1, 5),
(197, 26, 1, 1, 5),
(198, 26, 1, 2, 5),
(199, 26, 1, 3, 5),
(200, 26, 1, 4, 5),
(201, 26, 9, 1, 5),
(202, 26, 9, 2, 5),
(203, 26, 9, 3, 5),
(204, 26, 9, 4, 5),
(205, 26, 2, 1, 5),
(206, 26, 2, 2, 5),
(207, 26, 2, 3, 5),
(208, 26, 2, 4, 5),
(209, 26, 7, 1, 5),
(210, 26, 7, 2, 5),
(211, 26, 7, 3, 5),
(212, 26, 7, 4, 5),
(213, 26, 8, 1, 5),
(214, 26, 8, 2, 5),
(215, 26, 8, 3, 5),
(216, 26, 8, 4, 5),
(218, 28, 14, 1, 5),
(243, 17, 9, 1, 5),
(244, 17, 9, 2, 5),
(245, 17, 9, 3, 5),
(246, 17, 9, 4, 5),
(247, 17, 9, 5, 5),
(248, 17, 8, 1, 5),
(249, 17, 8, 2, 5),
(250, 17, 8, 3, 5),
(251, 17, 8, 4, 5),
(252, 17, 8, 5, 5),
(253, 17, 3, 1, 5),
(254, 17, 3, 2, 5),
(255, 17, 3, 3, 5),
(256, 17, 3, 4, 5),
(257, 17, 3, 5, 5),
(258, 18, 9, 1, 5),
(259, 18, 9, 2, 5),
(260, 18, 9, 3, 5),
(261, 18, 9, 4, 5),
(262, 18, 9, 5, 4),
(263, 18, 8, 1, 5),
(264, 18, 8, 2, 5),
(265, 18, 8, 3, 5),
(266, 18, 8, 4, 5),
(267, 18, 8, 5, 5),
(268, 18, 7, 1, 5),
(269, 18, 7, 2, 5),
(270, 18, 7, 3, 5),
(271, 18, 7, 4, 5),
(272, 18, 7, 5, 4),
(273, 29, 9, 1, 2),
(274, 29, 9, 2, 2),
(275, 29, 9, 3, 2),
(276, 29, 9, 4, 2),
(277, 29, 9, 5, 2),
(278, 29, 1, 1, 2),
(279, 29, 1, 2, 2),
(280, 29, 1, 3, 2),
(281, 29, 1, 4, 2),
(282, 29, 1, 5, 2),
(283, 29, 11, 1, 2),
(284, 29, 11, 2, 2),
(285, 29, 11, 3, 2),
(286, 29, 11, 4, 2),
(287, 29, 11, 5, 2),
(288, 29, 2, 1, 2),
(289, 29, 2, 2, 2),
(290, 29, 2, 3, 2),
(291, 29, 2, 4, 2),
(292, 29, 2, 5, 2),
(293, 29, 12, 1, 2),
(294, 29, 12, 2, 2),
(295, 29, 12, 3, 2),
(296, 29, 12, 4, 2),
(297, 29, 12, 5, 2),
(298, 38, 9, 1, 3),
(299, 38, 9, 2, 3),
(300, 38, 9, 3, 3),
(301, 38, 9, 4, 3),
(302, 38, 9, 5, 2),
(303, 38, 9, 6, 3),
(304, 38, 12, 1, 2),
(305, 38, 12, 2, 3),
(306, 38, 12, 3, 3),
(307, 38, 12, 4, 3),
(308, 38, 12, 5, 3),
(309, 38, 12, 6, 3),
(310, 19, 10, 1, 5),
(311, 19, 10, 2, 5),
(312, 19, 10, 3, 5),
(313, 19, 10, 4, 5),
(314, 19, 10, 5, 5),
(315, 19, 3, 1, 5),
(316, 19, 3, 2, 5),
(317, 19, 3, 3, 5),
(318, 19, 3, 4, 5),
(319, 19, 3, 5, 5),
(320, 19, 12, 1, 5),
(321, 19, 12, 2, 5),
(322, 19, 12, 3, 5),
(323, 19, 12, 5, 5),
(324, 19, 12, 4, 2),
(325, 33, 12, 1, 2),
(326, 33, 9, 1, 2),
(327, 33, 3, 1, 2),
(340, 39, 11, 1, 5),
(341, 39, 11, 2, 5),
(342, 39, 11, 3, 5),
(343, 39, 11, 4, 6),
(344, 39, 11, 5, 5),
(345, 40, 2, 1, 5),
(346, 40, 2, 2, 5),
(347, 40, 2, 3, 5),
(348, 40, 2, 4, 5),
(349, 40, 2, 5, 5),
(362, 30, 1, 1, 5),
(363, 30, 1, 2, 5),
(364, 30, 1, 3, 5),
(365, 30, 1, 4, 5),
(366, 30, 1, 5, 5),
(367, 30, 9, 1, 5),
(368, 30, 9, 2, 5),
(369, 30, 9, 3, 5),
(370, 30, 9, 4, 5),
(371, 30, 9, 5, 8),
(372, 30, 4, 1, 5),
(373, 30, 4, 2, 5),
(374, 30, 4, 3, 5),
(375, 30, 4, 4, 5),
(376, 30, 4, 5, 10),
(377, 24, 9, 1, 5),
(378, 24, 10, 1, 5),
(379, 24, 8, 1, 5),
(380, 24, 3, 1, 5),
(381, 41, 8, 1, 5),
(382, 41, 8, 2, 5),
(383, 41, 8, 3, 5),
(384, 41, 8, 4, 5),
(385, 41, 8, 5, 5),
(386, 41, 8, 6, 5),
(387, 41, 1, 1, 5),
(388, 41, 1, 2, 5),
(389, 41, 1, 3, 5),
(390, 41, 1, 4, 5),
(391, 41, 1, 5, 10),
(392, 41, 1, 6, 5),
(393, 41, 2, 1, 5),
(394, 41, 2, 2, 3),
(395, 41, 2, 3, 5),
(396, 41, 2, 4, 5),
(397, 41, 2, 5, 5),
(398, 41, 2, 6, 5),
(399, 41, 12, 1, 5),
(400, 41, 12, 2, 5),
(401, 41, 12, 3, 5),
(402, 41, 12, 4, 10),
(403, 41, 12, 5, 5),
(404, 41, 12, 6, 5),
(405, 41, 9, 1, 5),
(406, 41, 9, 2, 5),
(407, 41, 9, 3, 5),
(408, 41, 9, 4, 5),
(409, 41, 9, 5, 10),
(410, 41, 9, 6, 5),
(411, 41, 7, 1, 5),
(412, 41, 7, 2, 5),
(413, 41, 7, 3, 5),
(414, 41, 7, 4, 5),
(415, 41, 7, 5, 5),
(416, 41, 7, 6, 5),
(417, 42, 9, 1, 5),
(418, 42, 9, 2, 5),
(419, 42, 9, 3, 5),
(420, 42, 9, 4, 5),
(421, 42, 9, 5, 5),
(422, 42, 9, 6, 5),
(423, 43, 9, 1, 5),
(424, 32, 9, 1, 10),
(425, 32, 9, 2, 5),
(426, 32, 9, 3, 5),
(427, 32, 9, 4, 5),
(428, 32, 9, 5, 5),
(429, 32, 9, 6, 5),
(430, 32, 7, 1, 5),
(431, 32, 7, 2, 5),
(432, 32, 7, 3, 5),
(433, 32, 7, 4, 10),
(434, 32, 7, 5, 5),
(435, 32, 7, 6, 10),
(436, 31, 2, 1, 5),
(437, 31, 2, 2, 3),
(438, 31, 2, 3, 3),
(439, 31, 2, 4, 3),
(440, 31, 2, 5, 3),
(441, 31, 2, 6, 3),
(442, 31, 7, 1, 3),
(443, 31, 7, 2, 3),
(444, 31, 7, 3, 3),
(445, 31, 7, 4, 3),
(446, 31, 7, 5, 3),
(447, 31, 7, 6, 3),
(448, 44, 9, 1, 8),
(449, 44, 9, 2, 7),
(450, 44, 9, 3, 8),
(451, 44, 9, 4, 9),
(452, 44, 9, 5, 9),
(453, 44, 3, 1, 9),
(454, 44, 3, 2, 9),
(455, 44, 3, 3, 9),
(456, 44, 3, 4, 9),
(457, 44, 3, 5, 10),
(458, 44, 7, 1, 9),
(459, 44, 7, 2, 9),
(460, 44, 7, 3, 10),
(461, 44, 7, 4, 10),
(462, 44, 7, 5, 10),
(463, 15, 2, 1, 5),
(464, 15, 2, 2, 5),
(465, 15, 2, 3, 5),
(466, 15, 2, 4, 5),
(467, 15, 2, 5, 5),
(468, 15, 9, 1, 5),
(469, 15, 9, 2, 5),
(470, 15, 9, 3, 5),
(471, 15, 9, 4, 5),
(472, 15, 9, 5, 5),
(473, 15, 12, 1, 5),
(474, 15, 12, 2, 5),
(475, 15, 12, 3, 5),
(476, 15, 12, 4, 5),
(477, 15, 12, 5, 5),
(498, 25, 9, 1, 5),
(499, 25, 9, 2, 5),
(500, 25, 9, 3, 5),
(501, 25, 9, 4, 5),
(502, 25, 9, 5, 5),
(503, 25, 1, 1, 5),
(504, 25, 1, 2, 5),
(505, 25, 1, 3, 5),
(506, 25, 1, 4, 5),
(507, 25, 1, 5, 5),
(508, 25, 12, 1, 5),
(509, 25, 12, 2, 5),
(510, 25, 12, 3, 5),
(511, 25, 12, 4, 5),
(512, 25, 12, 5, 5),
(553, 47, 2, 1, 9),
(554, 47, 2, 2, 9),
(555, 47, 2, 3, 9),
(556, 47, 2, 4, 9),
(557, 47, 2, 5, 9),
(563, 49, 9, 1, 9),
(564, 49, 9, 2, 9),
(565, 49, 9, 3, 9),
(566, 49, 9, 4, 9),
(567, 49, 9, 5, 9),
(583, 51, 11, 1, 10),
(584, 51, 11, 2, 10),
(585, 51, 11, 3, 10),
(586, 51, 11, 4, 10),
(587, 51, 11, 5, 10),
(588, 52, 9, 1, 10),
(589, 52, 9, 2, 9),
(590, 52, 9, 3, 10),
(591, 52, 9, 4, 7),
(592, 52, 9, 5, 8),
(605, 53, 3, 1, 5),
(606, 53, 3, 2, 5),
(607, 53, 3, 3, 5),
(608, 53, 8, 1, 5),
(609, 53, 8, 2, 5),
(610, 53, 8, 3, 5),
(611, 53, 2, 1, 5),
(612, 53, 2, 2, 5),
(613, 53, 2, 3, 6),
(614, 53, 9, 1, 5),
(615, 53, 9, 2, 5),
(616, 53, 9, 3, 5),
(633, 54, 9, 1, 5),
(634, 54, 9, 3, 5),
(635, 54, 9, 4, 5),
(636, 54, 9, 5, 5),
(637, 21, 9, 2, 5),
(638, 21, 9, 3, 5),
(639, 21, 9, 4, 5),
(640, 21, 9, 5, 5),
(641, 21, 7, 2, 5),
(642, 21, 7, 3, 5),
(643, 21, 7, 4, 5),
(644, 21, 7, 5, 5),
(645, 21, 8, 2, 5),
(646, 21, 8, 3, 5),
(647, 21, 8, 4, 5),
(648, 21, 8, 5, 5),
(649, 21, 3, 2, 5),
(650, 21, 3, 3, 5),
(651, 21, 3, 4, 5),
(652, 21, 3, 5, 4),
(653, 55, 3, 1, 4),
(654, 55, 9, 2, 5),
(655, 55, 9, 4, 5),
(660, 58, 8, 1, 5),
(661, 58, 9, 1, 5),
(682, 16, 10, 1, 5),
(683, 16, 10, 2, 5),
(684, 16, 10, 3, 5),
(685, 16, 10, 4, 5),
(686, 16, 10, 5, 5),
(687, 16, 12, 1, 5),
(688, 16, 12, 2, 5),
(689, 16, 12, 3, 5),
(690, 16, 12, 4, 5),
(691, 16, 12, 5, 5),
(692, 16, 7, 1, 5),
(693, 16, 7, 2, 5),
(694, 16, 7, 3, 5),
(695, 16, 7, 4, 5),
(696, 16, 7, 5, 5),
(697, 16, 9, 1, 5),
(698, 16, 9, 2, 5),
(699, 16, 9, 3, 5),
(700, 16, 9, 4, 5),
(701, 16, 9, 5, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `talles`
--

CREATE TABLE `talles` (
  `id` int(10) UNSIGNED NOT NULL,
  `talle` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `talles`
--

INSERT INTO `talles` (`id`, `talle`) VALUES
(1, 'S'),
(2, 'M'),
(3, 'L'),
(4, 'XL'),
(5, 'XXL'),
(6, 'XXXL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos`
--

CREATE TABLE `tipos` (
  `id` int(10) UNSIGNED NOT NULL,
  `tipo` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos`
--

INSERT INTO `tipos` (`id`, `tipo`) VALUES
(1, 'regular-Remera'),
(2, 'oversize-Remera'),
(3, 'musculosa-Remera'),
(4, 'cargo-Jean'),
(5, 'mom-Jean'),
(6, 'algodon-Short'),
(7, 'jean-Short'),
(8, 'sastrero-Short'),
(9, 'boxyfit-Remera'),
(10, 'algodon-Bermuda'),
(11, 'jean-Bermuda'),
(12, 'sHORT2'),
(13, 'Lino - Shorts'),
(14, 'Sports - Remeras'),
(15, 'Sports - Shorts'),
(17, 'morley-Body'),
(18, 'microfibra-Body'),
(19, 'gorras-Accesorio'),
(20, 'bando-Superior'),
(21, 'top-Superior'),
(22, 'strapless-Superior'),
(23, 'corset-Superior');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `useradmin`
--

CREATE TABLE `useradmin` (
  `id` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `contrasena` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `useradmin`
--

INSERT INTO `useradmin` (`id`, `nombre`, `contrasena`) VALUES
(1, 'felusan', 'FelusanIND');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `colores`
--
ALTER TABLE `colores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tipo_id` (`tipo_id`);

--
-- Indices de la tabla `producto_fotos`
--
ALTER TABLE `producto_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_producto` (`producto_id`),
  ADD KEY `fk_color` (`color_id`);

--
-- Indices de la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `producto_id` (`producto_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `talle_id` (`talle_id`);

--
-- Indices de la tabla `talles`
--
ALTER TABLE `talles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tipos`
--
ALTER TABLE `tipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `useradmin`
--
ALTER TABLE `useradmin`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `colores`
--
ALTER TABLE `colores`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `producto_fotos`
--
ALTER TABLE `producto_fotos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=702;

--
-- AUTO_INCREMENT de la tabla `talles`
--
ALTER TABLE `talles`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tipos`
--
ALTER TABLE `tipos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `useradmin`
--
ALTER TABLE `useradmin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_tipo` FOREIGN KEY (`tipo_id`) REFERENCES `tipos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto_fotos`
--
ALTER TABLE `producto_fotos`
  ADD CONSTRAINT `fk_color` FOREIGN KEY (`color_id`) REFERENCES `colores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_producto` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto_variantes`
--
ALTER TABLE `producto_variantes`
  ADD CONSTRAINT `producto_variantes_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `producto_variantes_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `colores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `producto_variantes_ibfk_3` FOREIGN KEY (`talle_id`) REFERENCES `talles` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

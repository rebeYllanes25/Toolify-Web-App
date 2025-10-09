package com.ProyectoDAW.Ecommerce.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.common.BitMatrix;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.EnumMap;
import java.util.Map;

public class GeneradorUtil {

    private static final String LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMEROS = "0123456789";
    private static final SecureRandom random = new SecureRandom();


    //Genera un código de pedido con formato PED-XXX-XXX-XXX
    public static String generarCodigoPedido() {
        String bloque1 = generarCadenaAleatoria(LETRAS, 3);
        String bloque2 = generarCadenaAleatoria(NUMEROS, 3);
        String bloque3 = generarCadenaAleatoria(LETRAS, 3);
        return String.format("PED-%s-%s-%s", bloque1, bloque2, bloque3);
    }

    //Genera un código QR en Base64 (PNG) a partir de un texto (por ejemplo el código del pedido).
    //Pa mostrarlo en móvil
    public static String generarQRBase64(String texto) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();

            // Configuración del QR
            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M); // nivel medio
            hints.put(EncodeHintType.MARGIN, 1); // margen pequeño

            int size = 150;

            BitMatrix bitMatrix = qrCodeWriter.encode(texto, BarcodeFormat.QR_CODE, size, size, hints);

            // Convertir a imagen en memoria
            BufferedImage qrImage = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < size; x++) {
                for (int y = 0; y < size; y++) {
                    qrImage.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
                }
            }

            // Convertir la imagen a Base64
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            ImageIO.write(qrImage, "png", outputStream);
            return Base64.getEncoder().encodeToString(outputStream.toByteArray());

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error al generar el código QR", e);
        }
    }

    private static String generarCadenaAleatoria(String caracteres, int longitud) {
        StringBuilder sb = new StringBuilder(longitud);
        for (int i = 0; i < longitud; i++) {
            sb.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        return sb.toString();
    }
}

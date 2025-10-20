package com.ProyectoDAW.Ecommerce.util;

import java.time.Duration;
import java.time.LocalDateTime;

public class FechaUtils {

    public static Long calcularDiferenciaMinutos(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        if (fechaInicio == null || fechaFin == null) {
            return null;
        }

        Duration duracion = Duration.between(fechaInicio, fechaFin);
        return duracion.toMinutes();
    }
}

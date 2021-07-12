package com.surfinn.glzza.log;

import ch.qos.logback.classic.pattern.ClassicConverter;
import ch.qos.logback.classic.spi.ILoggingEvent;

public class ThreadIdConverter extends ClassicConverter
{
    private static int nextId = 0;

    private static final ThreadLocal<String> threadId = ThreadLocal.withInitial(() -> {
        int nextId = nextId();
        return String.format("%05d", nextId);
    });

    private static synchronized int nextId()
    {
        return ++nextId;
    }

    @Override
    public String convert(ILoggingEvent event)
    {
        return threadId.get();
    }
}
/*
 * Copyright (c) 2022. Rob Freundlich <rob@freundlichs.com> - All rights reserved.
 */

export class TimeUtils
{
  public static delay(msec: number, condition?: boolean): Promise<void>
  {
    if ((condition !== undefined) && !condition)
    {
      return Promise.resolve();
    }
    return new Promise((res => setTimeout(res, msec)));
  }

  public static getElapsedTime(start: number | Date, end: number | Date): string
  {
    if (start instanceof Date)
    {
      start = start.getTime();
    }

    if (end instanceof Date)
    {
      end = end.getTime();
    }

    const elapsedTimeMillis: number = end - start;

    if (elapsedTimeMillis < 1000)
    {
      return elapsedTimeMillis + "ms";
    }

    const elapsedTimeSeconds: number = (elapsedTimeMillis / 1000);

    if (elapsedTimeSeconds < 60)
    {
      return elapsedTimeSeconds.toFixed(3) + " seconds";
    }

    const elapsedTimeMinutes: number = Math.floor(elapsedTimeSeconds / 60);
    const remainingSeconds: number = elapsedTimeSeconds - (elapsedTimeMinutes * 60);

    if (elapsedTimeMinutes < 60)
    {
      return `${elapsedTimeMinutes} minutes, ${remainingSeconds.toFixed(0)} seconds`;
    }

    const elapsedHours: number = Math.floor(elapsedTimeMinutes / 60);
    const remainingMinutes: number = elapsedTimeMinutes - (elapsedHours * 60);

    return `${elapsedHours} hours, ${remainingMinutes.toFixed(0)} minutes`;
  }
}

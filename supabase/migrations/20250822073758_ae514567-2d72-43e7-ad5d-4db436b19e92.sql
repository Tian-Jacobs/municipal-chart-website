
-- 1) Complaints by Category
-- Returns rows like: { name: 'Water Leak', value: 45 }
CREATE OR REPLACE FUNCTION public.complaints_by_category(
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS TABLE(name text, value bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT sc.category_name AS name,
         COUNT(*)::bigint AS value
  FROM public.complaints c
  JOIN public.service_categories sc
    ON sc.category_id = c.category_id
  WHERE (start_date IS NULL OR c.submission_date >= start_date)
    AND (end_date IS NULL OR c.submission_date <= end_date)
  GROUP BY sc.category_name
  ORDER BY value DESC;
$$;


-- 2) Complaints by Ward
-- Returns rows like: { name: 'Ward 1', value: 34 }
CREATE OR REPLACE FUNCTION public.complaints_by_ward(
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS TABLE(name text, value bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT ('Ward ' || r.ward::text) AS name,
         COUNT(*)::bigint AS value
  FROM public.complaints c
  JOIN public.residents r
    ON r.resident_id = c.resident_id
  WHERE (start_date IS NULL OR c.submission_date >= start_date)
    AND (end_date IS NULL OR c.submission_date <= end_date)
  GROUP BY r.ward
  ORDER BY r.ward;
$$;


-- 3) Monthly Complaints Trend
-- Returns rows like: { name: 'Jan', value: 23 } ordered chronologically
CREATE OR REPLACE FUNCTION public.complaints_monthly(
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS TABLE(name text, value bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT to_char(date_trunc('month', c.submission_date), 'Mon') AS name,
         COUNT(*)::bigint AS value
  FROM public.complaints c
  WHERE (start_date IS NULL OR c.submission_date >= start_date)
    AND (end_date IS NULL OR c.submission_date <= end_date)
  GROUP BY date_trunc('month', c.submission_date)
  ORDER BY date_trunc('month', c.submission_date);
$$;


-- 4) Status Breakdown (based on status_logs records)
-- Returns rows like: { name: 'Resolved', value: 78 }
-- Note: This counts status_log entries in the date window.
CREATE OR REPLACE FUNCTION public.complaints_status(
  start_date date DEFAULT NULL,
  end_date date DEFAULT NULL
)
RETURNS TABLE(name text, value bigint)
LANGUAGE sql
STABLE
AS $$
  SELECT s.status AS name,
         COUNT(*)::bigint AS value
  FROM public.status_logs s
  WHERE (start_date IS NULL OR s.status_date >= start_date)
    AND (end_date IS NULL OR s.status_date <= end_date)
  GROUP BY s.status
  ORDER BY value DESC;
$$;

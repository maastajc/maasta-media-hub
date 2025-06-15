
CREATE OR REPLACE FUNCTION public.get_unique_categories()
 RETURNS SETOF text
 LANGUAGE sql
 STABLE
AS $function$
  SELECT DISTINCT category
  FROM public.auditions
  WHERE category IS NOT NULL AND category <> ''
  ORDER BY category;
$function$

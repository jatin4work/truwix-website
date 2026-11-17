ALTER TABLE public.posts ADD COLUMN image_url text, ADD COLUMN image_alt text, ADD COLUMN image_credit text, ADD COLUMN generation_key text;
CREATE UNIQUE INDEX posts_generation_key_unique ON public.posts(generation_key) WHERE generation_key IS NOT NULL;
CREATE TABLE public.blog_automation (id text PRIMARY KEY DEFAULT 'daily', paused boolean NOT NULL DEFAULT false, reason text, lease_token uuid, lease_until timestamptz, last_run timestamptz, last_success timestamptz);
GRANT SELECT ON public.blog_automation TO authenticated;
GRANT ALL ON public.blog_automation TO service_role;
ALTER TABLE public.blog_automation ENABLE ROW LEVEL SECURITY;
CREATE POLICY blog_automation_admin_read ON public.blog_automation FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.blog_jobs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), day date NOT NULL, slot integer NOT NULL, stage text NOT NULL DEFAULT 'research', research text, draft jsonb, post_id uuid REFERENCES public.posts(id), error text, UNIQUE(day,slot));
GRANT SELECT ON public.blog_jobs TO authenticated;
GRANT ALL ON public.blog_jobs TO service_role;
ALTER TABLE public.blog_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY blog_jobs_admin_read ON public.blog_jobs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE OR REPLACE FUNCTION public.claim_blog_run(token uuid) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.blog_automation(id) VALUES ('daily') ON CONFLICT DO NOTHING;
 UPDATE public.blog_automation SET lease_token=token, lease_until=now()+interval '10 minutes', last_run=now() WHERE id='daily' AND NOT paused AND (lease_until IS NULL OR lease_until<now());
 RETURN FOUND;
END $$;
REVOKE ALL ON FUNCTION public.claim_blog_run(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_blog_run(uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.complete_blog_job(job uuid, post jsonb) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE pid uuid; k text;
BEGIN
 SELECT day::text || ':' || slot::text INTO k FROM public.blog_jobs WHERE id=job FOR UPDATE;
 IF k IS NULL THEN RAISE EXCEPTION 'Unknown job'; END IF;
 INSERT INTO public.posts(title,slug,excerpt,category,content,image_url,image_alt,image_credit,source,published,generation_key)
 VALUES(post->>'title',post->>'slug',post->>'excerpt',post->>'category',post->>'content',post->>'image_url',post->>'image_alt',post->>'image_credit','ai',true,k)
 ON CONFLICT (generation_key) WHERE generation_key IS NOT NULL DO UPDATE SET generation_key=EXCLUDED.generation_key RETURNING id INTO pid;
 UPDATE public.blog_jobs SET stage='done',post_id=pid,error=NULL WHERE id=job;
 UPDATE public.blog_automation SET last_success=now() WHERE id='daily';
 RETURN pid;
END $$;
REVOKE ALL ON FUNCTION public.complete_blog_job(uuid,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_blog_job(uuid,jsonb) TO service_role;
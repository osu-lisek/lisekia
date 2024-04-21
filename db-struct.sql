--
-- PostgreSQL database dump
--

-- Dumped from database version 15.5
-- Dumped by pg_dump version 16.0

-- Started on 2024-02-09 15:36:15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 838 (class 1247 OID 24577)
-- Name: AlertType; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public."AlertType" AS ENUM (
    'maintenance',
    'alert'
);


ALTER TYPE public."AlertType" OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 24587)
-- Name: alerts; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.alerts (
    id bigint NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type public."AlertType" NOT NULL,
    started_at timestamp without time zone,
    ends_at timestamp with time zone
);


ALTER TABLE public.alerts OWNER TO "default";

--
-- TOC entry 215 (class 1259 OID 32769)
-- Name: alerts_id; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.alerts_id
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id OWNER TO "default";

--
-- TOC entry 2546 (class 0 OID 0)
-- Dependencies: 215
-- Name: alerts_id; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.alerts_id OWNED BY public.alerts.id;


--
-- TOC entry 2394 (class 2604 OID 32770)
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id'::regclass);


--
-- TOC entry 2539 (class 0 OID 24587)
-- Dependencies: 214
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.alerts (id, title, description, type, started_at, ends_at) FROM stdin;
1	Bancho outage	There will be planned bancho outage due to moving to new infrastructure.	maintenance	2024-02-09 12:01:58	2024-03-09 12:01:58+00
\.


--
-- TOC entry 2547 (class 0 OID 0)
-- Dependencies: 215
-- Name: alerts_id; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.alerts_id', 1, true);


--
-- TOC entry 2396 (class 2606 OID 24593)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


-- Completed on 2024-02-09 15:36:20

--
-- PostgreSQL database dump complete
--


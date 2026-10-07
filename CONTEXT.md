# Integreat App

A multi-brand web and native platform (Integreat, Malte, Aschaffenburg, …) that helps newcomers find local information, services, and support in their own language.

## Language

**Bescheid**:
An official letter, notice, or decision issued by a German authority (e.g. Jobcenter, Ausländerbehörde) that the Bescheid-Checker analyzes.
_Avoid_: Document, letter — too generic; a Bescheid is specifically an official authority decision.

**Bescheid-Checker**:
The tool that lets a user upload a Bescheid, get it OCR-scanned, translated, explained, and matched to suitable counseling options.

**Analysis**:
A single run of the Bescheid-Checker against one or more uploaded files for one Bescheid: OCR, translation, explanation, and counseling matching for that batch.
_Avoid_: Job, scan, request

**Counseling Profile**:
The small set of personal attributes (gender, age bracket, nationality bracket, spoken languages, region, legal/residence status) a user optionally provides so the Bescheid-Checker can surface suitable counseling options. Stored locally per device; it is not an account or identity, and outlives any single Analysis.
_Avoid_: Personal profile, user profile — implies a persistent account-like identity this isn't.

**Counseling Option**:
A single suggested counseling service or contact surfaced to the user, matched from an Analysis result and the user's Counseling Profile. Currently represented with the existing Place data shape (`PlaceModel`) as a placeholder; this reuse may be replaced with a dedicated type once the backend's actual data source is confirmed.

ALTER TABLE candidate_for_assessment
DROP CONSTRAINT candidate_for_assessment_candidate_fkey,
ADD CONSTRAINT candidate_for_assessment_candidate_fkey
   FOREIGN KEY (candidate)
   REFERENCES candidate(id)
   ON DELETE CASCADE;
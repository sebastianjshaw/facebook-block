Flow that is automatically actioned when you click the new Red X is Report post → Scam, fraud or false information → Sharing false information → Block [Name]’s profile.

To install: put both files in a folder, open chrome://extensions, turn on Developer mode, click Load unpacked, and pick that folder.

Caveats
It will break sometimes. Facebook changes its menu wording and structure often, so expect to adjust the text patterns now and then. They also only match English labels.
Keep it one click per block. Automating bulk blocking in the background could go against Facebook’s automation rules and get your account flagged. A button you click yourself is safe.
Report as “Spam”, not “False Information”. Facebook takes reports into account, so only use “False Information” when it’s true. The Spam route also has fewer steps.
Code here is a starting point. I haven’t run it against Facebook’s current pages. The exact labels need checking on your account in DevTools before it’ll work reliably.

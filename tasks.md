# perflab
web performance lab
# Notes:
- [x] Check performance implication (load event) of `install` phase (when used `skipWaiting` vs not using it) 
Results: There are some implication (http://www.webpagetest.org/result/170405_8B_1B36/ vs http://www.webpagetest.org/result/170405_46_1B6H/)
- [x] when a service worker is installed it applies to all pages, even those that doesn't have the service worker registration 
- [ ] Abilty to invalidate exsiting page
- [ ] Upadate current page with message.
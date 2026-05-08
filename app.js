// Initialize GSAP Animations
document.addEventListener("DOMContentLoaded", () => {
    gsap.from(".animate-in", { opacity: 0, y: 30, stagger: 0.2, duration: 1, ease: "power3.out" });
    toggleFields(); 
});

// The Schema Field Configurations
const fields = {
    local: `
        <div class="form-group"><label>Business Name</label><input type="text" id="bizName" placeholder="e.g. MediaOfficers"></div>
        <div class="form-group"><label>Type</label><input type="text" id="bizType" placeholder="e.g. LocalBusiness or HVACBusiness" value="LocalBusiness"></div>
        <div class="form-group"><label>Image URL</label><input type="text" id="bizImage" placeholder="https://example.com/logo.png"></div>
        <div class="form-group"><label>Telephone</label><input type="text" id="bizPhone" placeholder="+91 98765 43210"></div>
        <div class="form-group"><label>Street Address</label><input type="text" id="bizStreet" placeholder="123 SEO Street"></div>
        <div class="form-group"><label>City</label><input type="text" id="bizCity" placeholder="Ropar"></div>
    `,
    faq: `
        <div class="form-group"><label>Question 1</label><input type="text" id="faqQ1" placeholder="What is Technical SEO?"></div>
        <div class="form-group"><label>Answer 1</label><textarea id="faqA1" rows="3" placeholder="Technical SEO refers to..."></textarea></div>
        <div class="form-group"><label>Question 2</label><input type="text" id="faqQ2" placeholder="How do I rank higher?"></div>
        <div class="form-group"><label>Answer 2</label><textarea id="faqA2" rows="3" placeholder="By building topical authority..."></textarea></div>
    `,
    article: `
        <div class="form-group"><label>Headline</label><input type="text" id="artHeadline" placeholder="10 Best SEO Trends for 2026"></div>
        <div class="form-group"><label>Author Name</label><input type="text" id="artAuthor" placeholder="Keshav Sharma"></div>
        <div class="form-group"><label>Published Date</label><input type="date" id="artDate"></div>
        <div class="form-group"><label>Publisher (Company)</label><input type="text" id="artPublisher" placeholder="MediaOfficers" value="MediaOfficers"></div>
    `,
    product: `
        <div class="form-group"><label>Product Name</label><input type="text" id="prodName" placeholder="Premium SEO Audit"></div>
        <div class="form-group"><label>Price</label><input type="number" id="prodPrice" placeholder="499"></div>
        <div class="form-group"><label>Currency</label><input type="text" id="prodCurrency" placeholder="USD" value="USD"></div>
        <div class="form-group"><label>Rating (1-5)</label><input type="number" id="prodRating" placeholder="4.8" step="0.1"></div>
    `,
    event: `
        <div class="form-group"><label>Event Name</label><input type="text" id="eventName" placeholder="SEO Masterclass 2026"></div>
        <div class="form-group"><label>Start Date & Time</label><input type="datetime-local" id="eventDate"></div>
        <div class="form-group"><label>Location Name</label><input type="text" id="eventLocation" placeholder="MediaOfficers HQ"></div>
    `
};

function toggleFields() {
    const type = document.getElementById('schemaType').value;
    const container = document.getElementById('dynamicFields');
    
    gsap.to(container, {opacity: 0, duration: 0.2, onComplete: () => {
        container.innerHTML = fields[type];
        gsap.to(container, {opacity: 1, duration: 0.3});
        
        // Add Live-Update Listeners to all new inputs
        const inputs = container.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', generateSchema);
        });
        
        generateSchema(); // Generate initial empty schema
    }});
}

function generateSchema() {
    const type = document.getElementById('schemaType').value;
    let schema = { "@context": "https://schema.org" };

    try {
        if (type === 'local') {
            schema["@type"] = document.getElementById('bizType')?.value || "LocalBusiness";
            schema.name = document.getElementById('bizName')?.value || "";
            schema.image = document.getElementById('bizImage')?.value || "";
            schema.telephone = document.getElementById('bizPhone')?.value || "";
            schema.address = {
                "@type": "PostalAddress",
                "streetAddress": document.getElementById('bizStreet')?.value || "",
                "addressLocality": document.getElementById('bizCity')?.value || ""
            };
        } else if (type === 'faq') {
            schema["@type"] = "FAQPage";
            schema.mainEntity = [];
            if(document.getElementById('faqQ1')?.value) {
                schema.mainEntity.push({
                    "@type": "Question",
                    "name": document.getElementById('faqQ1').value,
                    "acceptedAnswer": { "@type": "Answer", "text": document.getElementById('faqA1').value }
                });
            }
            if(document.getElementById('faqQ2')?.value) {
                schema.mainEntity.push({
                    "@type": "Question",
                    "name": document.getElementById('faqQ2').value,
                    "acceptedAnswer": { "@type": "Answer", "text": document.getElementById('faqA2').value }
                });
            }
        } else if (type === 'article') {
            schema["@type"] = "Article";
            schema.headline = document.getElementById('artHeadline')?.value || "";
            schema.author = { "@type": "Person", "name": document.getElementById('artAuthor')?.value || "" };
            schema.datePublished = document.getElementById('artDate')?.value || "";
            schema.publisher = { "@type": "Organization", "name": document.getElementById('artPublisher')?.value || "" };
        } else if (type === 'product') {
            schema["@type"] = "Product";
            schema.name = document.getElementById('prodName')?.value || "";
            schema.offers = {
                "@type": "Offer",
                "priceCurrency": document.getElementById('prodCurrency')?.value || "USD",
                "price": document.getElementById('prodPrice')?.value || ""
            };
            if(document.getElementById('prodRating')?.value) {
                schema.aggregateRating = {
                    "@type": "AggregateRating",
                    "ratingValue": document.getElementById('prodRating').value,
                    "reviewCount": "1"
                };
            }
        } else if (type === 'event') {
            schema["@type"] = "Event";
            schema.name = document.getElementById('eventName')?.value || "";
            schema.startDate = document.getElementById('eventDate')?.value || "";
            schema.location = {
                "@type": "Place",
                "name": document.getElementById('eventLocation')?.value || ""
            };
        }

        const outputBox = document.getElementById('output');
        outputBox.innerText = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    } catch (e) {
        console.error("Waiting for complete input...");
    }
}

function copyCode() {
    const text = document.getElementById('output').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.btn');
        btn.innerText = "Copied! ✔️";
        setTimeout(() => btn.innerText = "Copy Code", 2000);
    });
}

// Initialize GSAP Animations on Load
document.addEventListener("DOMContentLoaded", () => {
    gsap.from(".animate-in", {
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out"
    });
    toggleFields(); // Load initial form fields
});

// Manage Dynamic Form Fields
const fields = {
    local: `
        <div class="form-group"><label>Business Name</label><input type="text" id="bizName" placeholder="e.g. MediaOfficers"></div>
        <div class="form-group"><label>Industry / Type</label><input type="text" id="bizType" placeholder="e.g. ProfessionalService or LocalBusiness" value="LocalBusiness"></div>
        <div class="form-group"><label>Image URL</label><input type="text" id="bizImage" placeholder="https://example.com/logo.png"></div>
        <div class="form-group"><label>Telephone</label><input type="text" id="bizPhone" placeholder="+91 98765 43210"></div>
        <div class="form-group"><label>Street Address</label><input type="text" id="bizStreet" placeholder="123 SEO Street"></div>
        <div class="form-group"><label>City</label><input type="text" id="bizCity" placeholder="Ropar"></div>
    `,
    faq: `
        <div class="form-group"><label>Question</label><input type="text" id="faqQ" placeholder="What is Technical SEO?"></div>
        <div class="form-group"><label>Answer</label><textarea id="faqA" rows="4" placeholder="Technical SEO refers to..."></textarea></div>
    `
};

function toggleFields() {
    const type = document.getElementById('schemaType').value;
    const container = document.getElementById('dynamicFields');
    
    // Animate transition
    gsap.to(container, {opacity: 0, duration: 0.2, onComplete: () => {
        container.innerHTML = fields[type];
        gsap.to(container, {opacity: 1, duration: 0.3});
    }});
}

// Generate the Schema
function generateSchema() {
    const type = document.getElementById('schemaType').value;
    let schema = {};

    if (type === 'local') {
        schema = {
            "@context": "https://schema.org",
            "@type": document.getElementById('bizType').value || "LocalBusiness",
            "name": document.getElementById('bizName').value,
            "image": document.getElementById('bizImage').value,
            "@id": "",
            "url": "",
            "telephone": document.getElementById('bizPhone').value,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": document.getElementById('bizStreet').value,
                "addressLocality": document.getElementById('bizCity').value,
                "addressCountry": "IN"
            }
        };
    } else if (type === 'faq') {
        schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{
                "@type": "Question",
                "name": document.getElementById('faqQ').value,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": document.getElementById('faqA').value
                }
            }]
        };
    }

    const outputBox = document.getElementById('output');
    outputBox.innerText = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
    
    // Flash animation to show it updated
    gsap.fromTo(outputBox, {backgroundColor: "#222"}, {backgroundColor: "#000", duration: 0.5});
}

// Copy to Clipboard
function copyCode() {
    const text = document.getElementById('output').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Schema copied to clipboard!");
    });
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllDomain } from "../api/domainApi";

export default function DomainPage() {
    const navigate = useNavigate();
    const [domains, setDomains] = useState([]);
    const { certificationId } = useParams();

    useEffect(() => {
        if(!certificationId) return;
        const fetchDomains = async () => {
            const res = await getAllDomain(certificationId);
            setDomains(res);
        }
    fetchDomains()
    }, [certificationId]);
    return (
        <div>
      <h1>Domains of Certification {certificationId}</h1>
      <ul>
        {domains.map((d) => (
          <li key={d.id}>{d.code}</li>
        ))}
      </ul>
    </div>
    )
}